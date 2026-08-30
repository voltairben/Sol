/** Static config for the site — channels, genres, links. */

export const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "localhost";

/** Supabase project region — the DB + realtime node the app actually talks to. */
export const SUPABASE_REGION = "eu-west-2";

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
    tag: "KICK_DECK",
    handle: "SOL_DNB",
    brand: "#53FC18",
  },
  {
    id: "twitch",
    href: "https://www.twitch.tv/sol_dnb1",
    tag: "TWITCH_DECK",
    handle: "sol_dnb1",
    brand: "#9146FF",
  },
  {
    id: "discord",
    href: "https://discord.gg/vnqMzMBEr",
    tag: "DISCORD_SERVER",
    handle: "join the server",
    brand: "#5865F2",
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/sol_dnb/",
    tag: "INSTAGRAM",
    handle: "@sol_dnb",
    brand: "#E1306C",
  },
] as const;

export type SocialLink = (typeof SOCIAL_LINKS)[number];
