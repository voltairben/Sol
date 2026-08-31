import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "./_og/card";

export const runtime = "nodejs";
export const alt = "SOL_DNB — live Drum & Bass, terminal club";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    eyebrow: "[ SYSTEM_ONLINE ]",
    title: "SOL_DNB",
    sub: "// TERMINAL CLUB",
  });
}
