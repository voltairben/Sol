import "server-only";

/**
 * Best-effort Discord webhook ping for a new track request. Called from the
 * `submitRequest` server action after a verified insert — so it can't be
 * spoofed or spammed the way a public /api route could. No-ops silently when
 * `DISCORD_WEBHOOK_URL` is unset; never throws.
 */
export async function notifyDiscordRequest(r: {
  artist: string;
  title: string;
  by: string;
}): Promise<void> {
  const url = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(4000),
      body: JSON.stringify({
        username: "SOL_PORTAL",
        embeds: [
          {
            title: "[NEW GRID REQUEST] // SOL_PORTAL",
            color: 0xff6b35,
            fields: [
              {
                name: "Track",
                value: `${r.artist} — ${r.title}`.slice(0, 1024),
              },
              {
                name: "Submitted by",
                value: (r.by || "anon").slice(0, 256),
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch {
    /* webhook is decoration — never break a request over it */
  }
}
