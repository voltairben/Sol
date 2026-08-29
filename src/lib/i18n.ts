"use client";

import { useLang } from "./lang-store";

/**
 * UI copy in both languages. Terminal identifiers (panel labels like
 * `track.requests`, tags like `[ KICK_DECK: LIVE ]`, shell prompts) are the
 * interface's machine vocabulary — they stay fixed in every language.
 */
const en = {
  nav_schedule: "schedule",
  nav_about: "about",

  on_air: "on air",
  off_air: "off air",

  live_now: "live now",
  live_sub: "broadcast in progress — tune in",

  console_locked: "console locked",
  checking_session: "checking session…",
  auth_prompt: "auth to open a request or upvote the queue.",
  queue_empty: "queue empty",
  empty_locked: "no requests yet — sign in to be the first.",
  empty_open: "no requests yet — open one above.",
  open_request: "open a request",
  ph_artist: "artist",
  ph_track: "track",
  submit_queue: "queue",
  on_deck: "on deck",
  upvote: "Upvote",
  signin_to_vote: "Sign in to vote",
  err_request_fields: "Enter both an artist and a track title.",
  err_request_auth: "Sign in to open a request.",

  connecting: "connecting…",

  ph_email: "enter email",
  email_label: "email address",
  newsletter_ok: "ACCESS GRANTED. VERIFY INBOX_",
  err_sub_invalid: "invalid request",
  err_sub_email: "enter a valid email",
  err_sub_unconfigured: "signup is not wired up yet",
  err_sub_failed: "send failed",
  err_network: "network error",

  sched_empty: "no transmissions logged on the grid.",
  sched_empty_sub: "check back soon, or join the Discord for go-live pings.",
  sched_tz: "all times CET (europe/amsterdam) unless noted",

  pt_waveform: "active output waveform",
  pt_desc_sub_drop: "Deep 80→30Hz sub rumble",
  pt_desc_wobble: "LFO-modulated heavy square",
  pt_desc_sweep: "Sawtooth bandpass sweep",
  pt_desc_riser: "Ascending cosmic sweep",

  return_to_deck: "return_to_deck",
  photo_alt: "SOL_DNB in the studio",
  h_profile: "profile",
  h_broadcasts: "broadcasts",

  autherr_kicker: "auth error",
  autherr_title: "Sign-in didn't complete",
  autherr_body:
    "The link expired or was already used. Head back and try again.",
  autherr_back: "back to sol",
} as const;

export type Dict = Record<keyof typeof en, string>;

const nl: Dict = {
  nav_schedule: "agenda",
  nav_about: "over",

  on_air: "live",
  off_air: "offline",

  live_now: "nu live",
  live_sub: "uitzending bezig — kijk mee",

  console_locked: "console vergrendeld",
  checking_session: "sessie controleren…",
  auth_prompt: "log in om een verzoek te openen of te stemmen.",
  queue_empty: "wachtrij leeg",
  empty_locked: "nog geen verzoeken — log in om de eerste te zijn.",
  empty_open: "nog geen verzoeken — open er hierboven een.",
  open_request: "verzoek openen",
  ph_artist: "artiest",
  ph_track: "nummer",
  submit_queue: "toevoegen",
  on_deck: "draait nu",
  upvote: "Stem omhoog",
  signin_to_vote: "Log in om te stemmen",
  err_request_fields: "Vul zowel een artiest als een titel in.",
  err_request_auth: "Log in om een verzoek te openen.",

  connecting: "verbinden…",

  ph_email: "voer e-mail in",
  email_label: "e-mailadres",
  newsletter_ok: "TOEGANG VERLEEND. CHECK INBOX_",
  err_sub_invalid: "ongeldig verzoek",
  err_sub_email: "voer een geldig e-mailadres in",
  err_sub_unconfigured: "aanmelden is nog niet gekoppeld",
  err_sub_failed: "verzenden mislukt",
  err_network: "netwerkfout",

  sched_empty: "nog geen uitzendingen op de grid.",
  sched_empty_sub: "check later terug, of join de Discord voor go-live pings.",
  sched_tz: "alle tijden CET (europe/amsterdam) tenzij anders vermeld",

  pt_waveform: "actief uitgangssignaal",
  pt_desc_sub_drop: "Diepe 80→30Hz sub-rumble",
  pt_desc_wobble: "LFO-gemoduleerde zware square",
  pt_desc_sweep: "Sawtooth bandpass-sweep",
  pt_desc_riser: "Oplopende kosmische sweep",

  return_to_deck: "terug_naar_deck",
  photo_alt: "SOL_DNB in de studio",
  h_profile: "profiel",
  h_broadcasts: "uitzendingen",

  autherr_kicker: "auth-fout",
  autherr_title: "Inloggen is niet voltooid",
  autherr_body:
    "De link is verlopen of al gebruikt. Ga terug en probeer het opnieuw.",
  autherr_back: "terug naar sol",
};

/** Current-language copy. Re-renders when the EN/NL toggle changes. */
export function useT(): Dict {
  return useLang() === "nl" ? nl : en;
}
