/** Static config for the site — channels, genres, links. */

export const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "localhost";

export const CHANNELS = {
  kick: "SOL_DNB",
  twitch: "sol_dnb1",
} as const;

export type StreamPlatform = keyof typeof CHANNELS;

export const DNB_GENRES = [
  "Liquid",
  "Dancefloor",
  "Neurofunk",
  "Jungle",
  "Breakbeat",
] as const;

export type DnbGenre = (typeof DNB_GENRES)[number];

export const SOCIAL_LINKS = [
  {
    id: "kick",
    href: "https://kick.com/SOL_DNB",
    tag: "KICK_DECK: LIVE",
    handle: "SOL_DNB",
    tone: "cyan",
  },
  {
    id: "twitch",
    href: "https://www.twitch.tv/sol_dnb1",
    tag: "TWITCH_DECK: OFFLINE_REPLAY",
    handle: "sol_dnb1",
    tone: "persimmon",
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/sol_dnb/",
    tag: "INSTAGRAM: STREAM_PICS",
    handle: "@sol_dnb",
    tone: "cyan",
  },
] as const;

export type SocialLink = (typeof SOCIAL_LINKS)[number];
