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

  auth_card_body:
    "Connect a session below to unlock the music cockpit and start requesting tracks.",
  auth_twitch: "connect session via twitch",
  auth_discord: "initialize discord session",
  queue_empty: "queue empty",
  empty_locked: "no requests yet — connect a session to be the first.",
  empty_open: "no requests yet — open one above.",
  open_request: "open a request",
  ph_artist: "artist",
  ph_track: "track",
  submit_queue: "queue",
  on_deck: "on deck",
  upvote: "Upvote",
  signin_to_vote: "Connect to vote",
  err_request_fields: "Enter both an artist and a track title.",
  err_request_auth: "Sign in to open a request.",

  connecting: "connecting…",

  ph_email: "enter email",
  email_label: "email address",
  newsletter_ok: "[ ACCESS_GRANTED. CHECK INBOX. ]",
  err_sub_invalid: "invalid request",
  err_sub_email: "enter a valid email",
  err_sub_unconfigured: "signup is not wired up yet",
  err_sub_failed: "send failed",
  err_network: "network error",

  sched_empty: "no transmissions logged on the grid.",
  sched_empty_sub: "check back soon, or join the Discord for go-live pings.",
  sched_live: "live now",
  sched_tz: "all times CET (europe/amsterdam) unless noted",

  pt_waveform: "active output waveform",
  pt_desc_sub_drop: "Deep 80→30Hz sub rumble",
  pt_desc_wobble: "LFO-modulated heavy square",
  pt_desc_sweep: "Sawtooth bandpass sweep",
  pt_desc_riser: "Ascending cosmic sweep",

  return_to_deck: "return_to_deck",
  photo_alt: "SOL_DNB in the studio",

  consent_title: "external signal link required",
  consent_body:
    "The Kick and Twitch players load from their own servers and set their own cookies. Pick how to run the deck:",
  consent_accept: "initialize signal trans-feed",
  consent_accept_sub: "loads the live stream — allows Kick / Twitch cookies",
  consent_decline: "run secure local console",
  consent_decline_sub:
    "everything except the embedded player — no third-party cookies",
  feed_blocked: "external feed blocked",
  feed_blocked_sub:
    "The Kick / Twitch player loads from its own servers and sets its own cookies.",
  feed_blocked_cta: "authorize cookies and load stream",

  footer_core: "transmission core",
  footer_tagline: "all rights to the bass reserved",
  footer_designed_by: "designed by",
  footer_cookies: "cookies",
  footer_privacy: "privacy",
  footer_contact: "contact",
  footer_latency: "latency",
  footer_node: "node",
  footer_build: "build",

  vinyl_live: "platter engaged · 33⅓ rpm",
  vinyl_idle: "platter idle",

  sig_live_sub: "telemetry locked — pulling live platform stats",
  sig_standby_sub: "no carrier on twitch or kick — deck on standby",

  sc_title: "system command shortcuts // index",
  sc_k: "toggle stream feed",
  sc_s: "focus track suggestion",
  sc_m: "toggle audio feedback",
  sc_h: "toggle this card",
  sc_close: "close",

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

  auth_card_body:
    "Verbind hieronder een sessie om de cockpit te ontgrendelen en tracks aan te vragen.",
  auth_twitch: "verbind sessie via twitch",
  auth_discord: "discord-sessie initialiseren",
  queue_empty: "wachtrij leeg",
  empty_locked: "nog geen verzoeken — verbind een sessie om de eerste te zijn.",
  empty_open: "nog geen verzoeken — open er hierboven een.",
  open_request: "verzoek openen",
  ph_artist: "artiest",
  ph_track: "nummer",
  submit_queue: "toevoegen",
  on_deck: "draait nu",
  upvote: "Stem omhoog",
  signin_to_vote: "Verbind om te stemmen",
  err_request_fields: "Vul zowel een artiest als een titel in.",
  err_request_auth: "Log in om een verzoek te openen.",

  connecting: "verbinden…",

  ph_email: "voer e-mail in",
  email_label: "e-mailadres",
  newsletter_ok: "[ TOEGANG_VERLEEND. CHECK INBOX. ]",
  err_sub_invalid: "ongeldig verzoek",
  err_sub_email: "voer een geldig e-mailadres in",
  err_sub_unconfigured: "aanmelden is nog niet gekoppeld",
  err_sub_failed: "verzenden mislukt",
  err_network: "netwerkfout",

  sched_empty: "nog geen uitzendingen op de grid.",
  sched_empty_sub: "check later terug, of join de Discord voor go-live pings.",
  sched_live: "nu live",
  sched_tz: "alle tijden CET (europe/amsterdam) tenzij anders vermeld",

  pt_waveform: "actief uitgangssignaal",
  pt_desc_sub_drop: "Diepe 80→30Hz sub-rumble",
  pt_desc_wobble: "LFO-gemoduleerde zware square",
  pt_desc_sweep: "Sawtooth bandpass-sweep",
  pt_desc_riser: "Oplopende kosmische sweep",

  return_to_deck: "terug_naar_deck",
  photo_alt: "SOL_DNB in de studio",

  consent_title: "externe signaalverbinding vereist",
  consent_body:
    "De Kick- en Twitch-spelers laden van hun eigen servers en plaatsen hun eigen cookies. Kies hoe je het deck draait:",
  consent_accept: "signaal-transfeed initialiseren",
  consent_accept_sub: "laadt de livestream — staat Kick / Twitch-cookies toe",
  consent_decline: "beveiligde lokale console draaien",
  consent_decline_sub:
    "alles behalve de ingesloten speler — geen cookies van derden",
  feed_blocked: "externe feed geblokkeerd",
  feed_blocked_sub:
    "De Kick- / Twitch-speler laadt van eigen servers en plaatst eigen cookies.",
  feed_blocked_cta: "cookies toestaan en stream laden",

  footer_core: "transmissiekern",
  footer_tagline: "alle rechten op de bass voorbehouden",
  footer_designed_by: "ontworpen door",
  footer_cookies: "cookies",
  footer_privacy: "privacy",
  footer_contact: "contact",
  footer_latency: "latency",
  footer_node: "node",
  footer_build: "build",

  sig_live_sub: "telemetrie vergrendeld — live platformstats binnen",
  sig_standby_sub: "geen signaal op twitch of kick — deck op standby",

  vinyl_live: "plaat draait · 33⅓ rpm",
  vinyl_idle: "plaat stil",

  sc_title: "systeemcommando's // index",
  sc_k: "wissel stream feed",
  sc_s: "focus nummerverzoek",
  sc_m: "wissel audio feedback",
  sc_h: "toon/verberg deze kaart",
  sc_close: "sluiten",

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
