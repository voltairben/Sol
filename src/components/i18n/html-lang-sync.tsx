"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/lang-store";

/** Keeps <html lang> in step with the EN/NL toggle for a11y + SEO. */
export function HtmlLangSync() {
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
