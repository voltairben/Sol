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
  { label: "instagram", value: "@sol_dnb", href: "https://www.instagram.com/sol_dnb/" },
  { label: "kick", value: CHANNELS.kick, href: `https://kick.com/${CHANNELS.kick}` },
  { label: "twitch", value: CHANNELS.twitch, href: `https://twitch.tv/${CHANNELS.twitch}` },
] as const;
