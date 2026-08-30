import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "SOL_DNB — live Drum & Bass, terminal club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0B0F19";
const TEXT = "#C8D0DC";
const DIM = "#6B7688";
const PERSIMMON = "#FF6B35";
const CYAN = "#00F0FF";
const BORDER = "#1E2A38";

export default async function OpengraphImage() {
  const font = (name: string) =>
    readFile(fileURLToPath(new URL(`./_fonts/${name}`, import.meta.url)));
  const [bold, regular] = await Promise.all([
    font("JetBrainsMono-Bold.ttf"),
    font("JetBrainsMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: BG,
          color: TEXT,
          fontFamily: "JBM",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* persimmon signal bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: PERSIMMON,
          }}
        />
        {/* corner brackets */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 48,
            width: 40,
            height: 40,
            borderTop: `3px solid ${CYAN}`,
            borderLeft: `3px solid ${CYAN}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 48,
            width: 40,
            height: 40,
            borderBottom: `3px solid ${CYAN}`,
            borderRight: `3px solid ${CYAN}`,
          }}
        />

        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            color: CYAN,
          }}
        >
          [ SYSTEM_ONLINE ]
        </div>

        <div
          style={{
            fontSize: 148,
            fontWeight: 700,
            letterSpacing: 10,
            lineHeight: 1,
            marginTop: 24,
          }}
        >
          SOL_DNB
        </div>

        <div
          style={{
            fontSize: 42,
            letterSpacing: 6,
            color: PERSIMMON,
            marginTop: 12,
          }}
        >
          {"// TERMINAL CLUB"}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 3,
            color: DIM,
            marginTop: 48,
            paddingTop: 28,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          LIVE DRUM &amp; BASS &nbsp;·&nbsp; KICK / TWITCH &nbsp;·&nbsp; REAL-TIME
          REQUESTS
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            color: DIM,
            marginTop: 24,
          }}
        >
          guest@sol_portal:~${" "}
          <span
            style={{
              display: "flex",
              width: 14,
              height: 24,
              background: PERSIMMON,
              marginLeft: 10,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "JBM", data: bold, weight: 700, style: "normal" },
        { name: "JBM", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
