import type { MetadataRoute } from "next";
import { getSiteURL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth/"],
    },
    sitemap: `${getSiteURL()}/sitemap.xml`,
  };
}
