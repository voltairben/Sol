import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "../_og/card";

export const runtime = "nodejs";
export const alt = "SOL_DNB — privacy & beveiliging";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    eyebrow: "[ SOL_DNB // COMPLIANCE_MANIFEST ]",
    title: "PRIVACYBELEID",
    sub: "// AVG / GDPR",
  });
}
