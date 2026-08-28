import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { AuthProvider } from "@/components/auth/auth-provider";
import { StreamStateProvider } from "@/components/stream/stream-state-provider";
import { SiteHeader } from "@/components/layout/site-header";
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

export const metadata: Metadata = {
  title: "SOL_DNB // terminal club",
  description:
    "Live Drum & Bass from SOL_DNB — stream console, real-time track requests, and broadcast schedule.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${jetbrainsMono.variable} ${departureMono.variable} h-full antialiased`}
    >
      <body className="crt min-h-full">
        <AuthProvider>
          <StreamStateProvider>
            <SiteHeader />
            {children}
          </StreamStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
