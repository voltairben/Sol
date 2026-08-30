import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { AuthProvider } from "@/components/auth/auth-provider";
import { StreamStateProvider } from "@/components/stream/stream-state-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { Footer } from "@/components/layout/footer";
import { HtmlLangSync } from "@/components/i18n/html-lang-sync";
import { BlackHoleBackground } from "@/components/effects/black-hole-background";
import { Analytics } from "@vercel/analytics/next";
import { getSiteURL } from "@/lib/site-url";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// Display face only — titles, LIVE/ON-AIR alerts, the ASCII logo layer.
const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
  weight: "400",
  display: "swap",
  preload: false,
});

const description =
  "Live Drum & Bass from SOL_DNB — stream console, real-time track requests, and broadcast schedule.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteURL()),
  title: "SOL_DNB // terminal club",
  description,
  applicationName: "SOL_DNB",
  openGraph: {
    type: "website",
    siteName: "SOL_DNB",
    title: "SOL_DNB // terminal club",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "SOL_DNB // terminal club",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${jetbrainsMono.variable} ${departureMono.variable} h-full antialiased`}
    >
      <body className="crt min-h-full">
        <BlackHoleBackground />
        <HtmlLangSync />
        <AuthProvider>
          <StreamStateProvider>
            <SiteHeader />
            {children}
            <Footer
              commit={process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null}
            />
          </StreamStateProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
