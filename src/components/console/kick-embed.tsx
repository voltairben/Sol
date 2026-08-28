import { CHANNELS } from "@/lib/constants";

export function KickEmbed() {
  return (
    <iframe
      src={`https://player.kick.com/${CHANNELS.kick}`}
      title={`${CHANNELS.kick} on Kick`}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 h-full w-full"
    />
  );
}
