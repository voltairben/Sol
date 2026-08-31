import type { Metadata, Viewport } from "next";
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
  "Live vinyl & digitale Drum & Bass van SOL_DNB — stream console, realtime track-requests en het uitzendschema.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteURL()),
  title: {
    default: "SOL_DNB // terminal club",
    template: "%s // SOL_DNB",
  },
  description,
  applicationName: "SOL_DNB",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "SOL_DNB",
  },
  keywords: [
    "SOL_DNB",
    "Drum & Bass",
    "DNB",
    "livestream",
    "vinyl",
    "Twitch",
    "Kick",
    "track request",
    "terminal club",
  ],
  authors: [{ name: "SOL_DNB" }],
  creator: "SOL_DNB",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/",
    siteName: "SOL_DNB",
    description,
  },
  twitter: {
    card: "summary_large_image",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
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
