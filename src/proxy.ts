import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 renamed `middleware` to `proxy`. A `middleware.ts` file is ignored
// by default in v16, so this MUST stay named `proxy.ts` / `export function proxy`.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every path except:
     * - _next/static, _next/image (build assets)
     * - favicon / icon / og image / robots / sitemap
     * - anything with a file extension (images, fonts, .glb models, ...)
     *
     * Server Actions POST to the route they live on, so excluding a path here
     * also skips session refresh for its actions. Auth checks still live inside
     * each action regardless.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|opengraph-image|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)",
  ],
};
