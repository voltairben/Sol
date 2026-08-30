"""
SOL_DNB portal — OBS stream-state + encoder telemetry sync.

Load in OBS: Tools -> Scripts -> + -> this file.
Then set "Portal API URL", "Stream token" and (optionally) the telemetry
interval in the script settings panel.

Behaviour:
  - Start Streaming  -> POST { is_live: true }, then every N seconds POST
                        live encoder health (bitrate, fps, dropped frames).
  - Stop Streaming   -> POST { is_live: false } (telemetry resets to 0 server-side).

The portal flips the "LIVE NOW" banner + vinyl turntable and streams the
encoder numbers into the console signal monitor in real time — no /admin toggle.

Stdlib only (urllib, json, threading). Works with the Python bundled in OBS 28+.
"""

import json
import threading
import time
import urllib.error
import urllib.request

import obspython as obs

# ── settings (filled from the OBS script panel) ────────────────────────
API_URL = "https://soldnb.com/api/stream/status"
TOKEN = ""
INTERVAL = 10  # seconds between telemetry pushes while live (min 5)

LOG_PREFIX = "[SOL_DNB sync]"

_timer_running = False
# rolling baseline for the bitrate delta calc
_prev_bytes = 0
_prev_ts = 0.0


# ── telemetry collection ──────────────────────────────────────────────
def _reset_baseline():
    global _prev_bytes, _prev_ts
    _prev_bytes = 0
    _prev_ts = 0.0


def _collect_metrics():
    """Return (bitrate_kbps, fps, dropped_frames) from the active stream output."""
    global _prev_bytes, _prev_ts
    bitrate = 0
    dropped = 0

    output = obs.obs_frontend_get_streaming_output()
    if output is not None:
        try:
            total_bytes = obs.obs_output_get_total_bytes(output)
            now = time.monotonic()
            # first sample after (re)start just sets the baseline
            if _prev_ts and now > _prev_ts:
                bits = (total_bytes - _prev_bytes) * 8
                if bits > 0:
                    bitrate = int(bits / (now - _prev_ts) / 1000)
            _prev_bytes = total_bytes
            _prev_ts = now
            dropped = int(obs.obs_output_get_frames_dropped(output))
        finally:
            obs.obs_output_release(output)

    fps = int(round(obs.obs_get_active_fps() or 0))
    return bitrate, fps, dropped


# ── HTTP (off the OBS thread) ─────────────────────────────────────────
def _post(is_live, bitrate=0, fps=0, dropped=0):
    if not API_URL or not TOKEN:
        obs.script_log(obs.LOG_WARNING, f"{LOG_PREFIX} URL or token not set — skipping.")
        return

    body = json.dumps(
        {
            "is_live": bool(is_live),
            "bitrate": bitrate,
            "fps": fps,
            "dropped_frames": dropped,
        }
    ).encode("utf-8")

    def worker():
        request = urllib.request.Request(
            API_URL,
            data=body,
            method="POST",
            headers={"content-type": "application/json", "x-stream-token": TOKEN},
        )
        try:
            with urllib.request.urlopen(request, timeout=5) as response:
                obs.script_log(
                    obs.LOG_INFO,
                    f"{LOG_PREFIX} ok ({response.status}) — live={bool(is_live)} "
                    f"{bitrate}kbps {fps}fps drop={dropped}",
                )
        except urllib.error.HTTPError as err:
            hint = " (wrong or unset STREAM_STATUS_TOKEN)" if err.code == 401 else ""
            detail = err.read().decode("utf-8", "replace")[:200]
            obs.script_log(obs.LOG_ERROR, f"{LOG_PREFIX} HTTP {err.code}{hint}: {detail}")
        except Exception as err:  # noqa: BLE001 — network/DNS/timeout, log and move on
            obs.script_log(obs.LOG_ERROR, f"{LOG_PREFIX} request failed: {err}")

    threading.Thread(target=worker, daemon=True).start()


# ── timer ────────────────────────────────────────────────────────────
def _telemetry_tick():
    if obs.obs_frontend_streaming_active():
        _post(True, *_collect_metrics())
    else:
        _stop_timer()


def _start_timer():
    global _timer_running
    if not _timer_running:
        obs.timer_add(_telemetry_tick, max(5, INTERVAL) * 1000)
        _timer_running = True
        obs.script_log(obs.LOG_INFO, f"{LOG_PREFIX} telemetry monitor on ({INTERVAL}s).")


def _stop_timer():
    global _timer_running
    if _timer_running:
        obs.timer_remove(_telemetry_tick)
        _timer_running = False
        obs.script_log(obs.LOG_INFO, f"{LOG_PREFIX} telemetry monitor off.")


# ── OBS frontend events ──────────────────────────────────────────────
def _on_event(event):
    if event == obs.OBS_FRONTEND_EVENT_STREAMING_STARTED:
        obs.script_log(obs.LOG_INFO, f"{LOG_PREFIX} streaming started -> LIVE")
        _reset_baseline()
        _post(True)
        _start_timer()
    elif event == obs.OBS_FRONTEND_EVENT_STREAMING_STOPPED:
        obs.script_log(obs.LOG_INFO, f"{LOG_PREFIX} streaming stopped -> OFFLINE")
        _stop_timer()
        _reset_baseline()
        _post(False)


# ── OBS script hooks ─────────────────────────────────────────────────
def script_description():
    return (
        "Syncs OBS streaming state and live encoder health (bitrate, fps, "
        "dropped frames) with the SOL_DNB portal. Set the API URL and token "
        "below, then just Start/Stop Streaming."
    )


def script_properties():
    props = obs.obs_properties_create()
    obs.obs_properties_add_text(props, "api_url", "Portal API URL", obs.OBS_TEXT_DEFAULT)
    obs.obs_properties_add_text(
        props, "token", "Stream token (STREAM_STATUS_TOKEN)", obs.OBS_TEXT_PASSWORD
    )
    obs.obs_properties_add_int(
        props, "interval", "Telemetry interval (seconds)", 5, 120, 1
    )
    obs.obs_properties_add_button(
        props,
        "test_live",
        "Test: force LIVE",
        lambda *_: _post(True, *_collect_metrics()) or True,
    )
    obs.obs_properties_add_button(
        props, "test_offline", "Test: force OFFLINE", lambda *_: _post(False) or True
    )
    return props


def script_defaults(settings):
    obs.obs_data_set_default_string(settings, "api_url", API_URL)
    obs.obs_data_set_default_int(settings, "interval", INTERVAL)


def script_update(settings):
    global API_URL, TOKEN, INTERVAL
    API_URL = obs.obs_data_get_string(settings, "api_url").strip()
    TOKEN = obs.obs_data_get_string(settings, "token").strip()
    new_interval = max(5, obs.obs_data_get_int(settings, "interval"))
    if new_interval != INTERVAL:
        INTERVAL = new_interval
        if _timer_running:
            _stop_timer()
            _start_timer()


def script_load(settings):
    obs.obs_frontend_add_event_callback(_on_event)
    if obs.obs_frontend_streaming_active():
        _reset_baseline()
        _start_timer()
    obs.script_log(obs.LOG_INFO, f"{LOG_PREFIX} loaded — listening for stream events.")


def script_unload():
    obs.obs_frontend_remove_event_callback(_on_event)
    _stop_timer()
