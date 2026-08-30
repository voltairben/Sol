"""
SOL_DNB portal — OBS stream-state sync.

Load in OBS: Tools -> Scripts -> + -> this file.
Then set "Portal API URL" and "Stream token" in the script settings panel.

When you Start/Stop Streaming in OBS, this fires a POST at the portal so the
"LIVE NOW" banner + vinyl turntable flip automatically — no /admin toggle.

Stdlib only (urllib, json). Works with the Python bundled in OBS 28+.
"""

import json
import urllib.error
import urllib.request

import obspython as obs

# ── settings (filled from the OBS script panel) ─────────────────────────
API_URL = "https://soldnb.com/api/stream/status"
TOKEN = ""

LOG_PREFIX = "[SOL_DNB sync]"


def _post_status(is_live):
    if not API_URL or not TOKEN:
        obs.script_log(obs.LOG_WARNING, f"{LOG_PREFIX} URL or token not set — skipping.")
        return

    payload = json.dumps({"is_live": bool(is_live)}).encode("utf-8")
    request = urllib.request.Request(
        API_URL,
        data=payload,
        method="POST",
        headers={
            "content-type": "application/json",
            "x-stream-token": TOKEN,
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=6) as response:
            obs.script_log(
                obs.LOG_INFO,
                f"{LOG_PREFIX} ok ({response.status}) — is_live={bool(is_live)}",
            )
    except urllib.error.HTTPError as err:
        detail = err.read().decode("utf-8", "replace")[:200]
        hint = " (wrong or unset STREAM_STATUS_TOKEN)" if err.code == 401 else ""
        obs.script_log(
            obs.LOG_ERROR, f"{LOG_PREFIX} HTTP {err.code}{hint}: {detail}"
        )
    except Exception as err:  # noqa: BLE001 — network/DNS/timeout, log and move on
        obs.script_log(obs.LOG_ERROR, f"{LOG_PREFIX} request failed: {err}")


def _on_event(event):
    if event == obs.OBS_FRONTEND_EVENT_STREAMING_STARTED:
        obs.script_log(obs.LOG_INFO, f"{LOG_PREFIX} streaming started -> LIVE")
        _post_status(True)
    elif event == obs.OBS_FRONTEND_EVENT_STREAMING_STOPPED:
        obs.script_log(obs.LOG_INFO, f"{LOG_PREFIX} streaming stopped -> OFFLINE")
        _post_status(False)


# ── OBS script hooks ───────────────────────────────────────────────────
def script_description():
    return (
        "Syncs OBS streaming state with the SOL_DNB portal 'LIVE NOW' banner. "
        "Set the API URL and token below, then just Start/Stop Streaming."
    )


def script_properties():
    props = obs.obs_properties_create()
    obs.obs_properties_add_text(
        props, "api_url", "Portal API URL", obs.OBS_TEXT_DEFAULT
    )
    obs.obs_properties_add_text(
        props, "token", "Stream token (STREAM_STATUS_TOKEN)", obs.OBS_TEXT_PASSWORD
    )
    obs.obs_properties_add_button(
        props, "test_live", "Test: force LIVE", lambda *_: _post_status(True) or True
    )
    obs.obs_properties_add_button(
        props,
        "test_offline",
        "Test: force OFFLINE",
        lambda *_: _post_status(False) or True,
    )
    return props


def script_defaults(settings):
    obs.obs_data_set_default_string(settings, "api_url", API_URL)


def script_update(settings):
    global API_URL, TOKEN
    API_URL = obs.obs_data_get_string(settings, "api_url").strip()
    TOKEN = obs.obs_data_get_string(settings, "token").strip()


def script_load(settings):
    obs.obs_frontend_add_event_callback(_on_event)
    obs.script_log(obs.LOG_INFO, f"{LOG_PREFIX} loaded — listening for stream events.")


def script_unload():
    obs.obs_frontend_remove_event_callback(_on_event)
