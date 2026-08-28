"use client";

import { useSyncExternalStore } from "react";
import { CHANNELS } from "@/lib/constants";

/**
 * Twitch blocks embeds unless every host it will be framed on is listed as a
 * `parent`. We derive that from the live hostname (covers preview + prod URLs)
 * and always include localhost for dev.
 */

const noop = () => () => {};
const BASE = `https://player.twitch.tv/?channel=${CHANNELS.twitch}`;

function liveSrc(): string {
  const parents = new Set<string>(["localhost"]);
  try {
    if (window.location.hostname) parents.add(window.location.hostname);
  } catch {
    /* ignore */
  }
  const query = [...parents]
    .map((p) => `parent=${encodeURIComponent(p)}`)
    .join("&");
  return `${BASE}&${query}`;
}

export function TwitchEmbed() {
  const src = useSyncExternalStore(
    noop,
    liveSrc,
    () => `${BASE}&parent=localhost`,
  );

  return (
    <iframe
      src={src}
      title={`${CHANNELS.twitch} on Twitch`}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 h-full w-full"
    />
  );
}
