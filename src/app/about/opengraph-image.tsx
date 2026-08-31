import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "../_og/card";

export const runtime = "nodejs";
export const alt = "Over SOL_DNB — vinyl & digital Drum & Bass";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    eyebrow: "[ SOL_DNB // PILOT_MANIFEST ]",
    title: "PROFIEL",
    sub: "// vinyl & digital D&B",
  });
}
