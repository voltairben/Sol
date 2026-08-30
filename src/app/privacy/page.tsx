import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { CONTACT_EMAIL, SUPABASE_REGION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "privacy // SOL_DNB",
  description:
    "How the SOL_DNB portal handles data — privacy-first by design: no tracking, essential state only, third-party embeds blocked until you consent.",
};

type LogBlock = { code: string; tone: "cyan" | "persimmon" | "dim"; body: React.ReactNode };

const TONE: Record<LogBlock["tone"], string> = {
  cyan: "text-[var(--cyan)]",
  persimmon: "text-[var(--persimmon)]",
  dim: "text-[var(--text-dim)]",
};

const BLOCKS: LogBlock[] = [
  {
    code: "LOG_01 // NO_TRACKING",
    tone: "cyan",
    body: (
      <p>
        No analytics, no advertising pixels, no fingerprinting, no third-party
        trackers run on our side of this site. We do not build behavioural
        profiles and we do not sell or share data. The only numbers we look at
        are aggregate server logs from our host.
      </p>
    ),
  },
  {
    code: "LOG_02 // LOCAL_STATE",
    tone: "cyan",
    body: (
      <>
        <p>
          A handful of keys live in your browser&apos;s localStorage purely to
          remember functional choices. They are never transmitted to us:
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>
            <span className="text-[var(--persimmon)]">›</span>{" "}
            <code>sol_consent</code> — your answer to the feed-consent gate
          </li>
          <li>
            <span className="text-[var(--persimmon)]">›</span>{" "}
            <code>sol:lang</code> — EN / NL preference
          </li>
          <li>
            <span className="text-[var(--persimmon)]">›</span>{" "}
            <code>sol:player</code> — KICK or TWITCH selection
          </li>
          <li>
            <span className="text-[var(--persimmon)]">›</span>{" "}
            <code>sol:audio</code> — console SFX on / off
          </li>
        </ul>
        <p className="mt-2">
          The boot screen&apos;s &ldquo;already played&rdquo; flag lives only in
          memory and resets on every full page load. Clearing site data removes
          all of the above.
        </p>
      </>
    ),
  },
  {
    code: "LOG_03 // SESSION_AUTH",
    tone: "cyan",
    body: (
      <>
        <p>
          Signing in to suggest or upvote a track uses Supabase Auth with Twitch
          or Discord OAuth. This sets an essential session cookie and stores a
          session token in localStorage so you stay logged in across pages —
          standard, strictly-necessary session handling, only active once you
          choose to sign in.
        </p>
        <p className="mt-2">
          From the provider we receive your <em>display name</em> and{" "}
          <em>avatar URL</em>. We store those alongside the track requests and
          votes you create, linked to your account id. Nothing else.
        </p>
      </>
    ),
  },
  {
    code: "LOG_04 // THIRD_PARTY_EMBEDS",
    tone: "persimmon",
    body: (
      <>
        <p>
          The Twitch and Kick players are iframes served from{" "}
          <code>twitch.tv</code> / <code>kick.com</code>. When loaded they set
          their own cookies and are governed by their own privacy policies.
        </p>
        <p className="mt-2">
          These embeds are <strong>blocked by default</strong>. Nothing loads
          from Twitch or Kick until you explicitly choose{" "}
          <code>INITIALIZE SIGNAL TRANS-FEED</code> on the boot consent gate (or
          click the blocked-feed card on the stream). You can revoke that choice
          any time with <code>[ COOKIES ]</code> in the footer.
        </p>
      </>
    ),
  },
  {
    code: "LOG_05 // NEWSLETTER",
    tone: "cyan",
    body: (
      <p>
        If you submit your email to the signup prompt, it is passed to Resend
        (our email provider) to send a confirmation and, if a mailing list is
        configured, to store you as a contact. Every email carries an unsubscribe
        link; unsubscribing removes you from the list. We use your address for
        nothing but go-live and set announcements.
      </p>
    ),
  },
  {
    code: "LOG_06 // DISCORD_RELAY",
    tone: "dim",
    body: (
      <p>
        When enabled, a successful track request is relayed to SOL_DNB&apos;s
        private team channel on Discord — the artist, the title, and your
        display name. This is a one-way notification; the channel is not public.
      </p>
    ),
  },
  {
    code: "LOG_07 // INFRASTRUCTURE",
    tone: "dim",
    body: (
      <>
        <p>
          The site is hosted on Vercel, which keeps standard request logs (IP,
          user-agent, timestamp) for operational and security purposes. The
          database and realtime layer are Supabase, hosted in the EU (
          <code>{SUPABASE_REGION}</code>).
        </p>
        <p className="mt-2">
          Legal basis: essential cookies and session handling rest on
          legitimate interest / performance of the service you requested;
          third-party embeds and the newsletter rest on your consent.
        </p>
      </>
    ),
  },
  {
    code: "LOG_08 // YOUR_RIGHTS",
    tone: "persimmon",
    body: (
      <>
        <p>
          You can request access to, correction of, or deletion of any data tied
          to your account, and you can object to processing or ask for a copy.
          Deleting your account removes your profile data; your track requests
          and votes cascade-delete with it.
        </p>
        <p className="mt-2">
          To make a request, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[var(--cyan)] underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          or reach SOL_DNB through the channels on the{" "}
          <a href="/about" className="text-[var(--cyan)] underline underline-offset-2">
            /about
          </a>{" "}
          page. You also have the right to complain to your local data
          protection authority (in the Netherlands, the Autoriteit
          Persoonsgegevens).
        </p>
      </>
    ),
  },
  {
    code: "LOG_09 // RETENTION",
    tone: "dim",
    body: (
      <p>
        Track requests are kept until cleared by SOL_DNB. Account and session
        data are kept until you delete your account or your session expires.
        Newsletter contacts are kept until you unsubscribe. Browser storage is
        kept until you clear it.
      </p>
    ),
  },
  {
    code: "LOG_10 // CHANGES",
    tone: "dim",
    body: (
      <p>
        Material changes to this manifest are posted on this page. This is the
        canonical English version.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pt-8 pb-16">
      <BackdropScrim />

      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <BackLink />
      </div>

      <header className="flex flex-col gap-1">
        <span className="font-departure text-[0.55rem] uppercase tracking-[0.25em] text-[var(--persimmon)]">
          [ compliance_manifest ]
        </span>
        <h1 className="font-departure text-lg uppercase tracking-[0.2em] text-[var(--text)] md:text-xl">
          [ system_log // privacy_&amp;_security_manifest ]
        </h1>
        <p className="mt-1 font-mono text-[0.72rem] text-[var(--text-dim)]">
          Privacy-first by construction. Read top to bottom.
        </p>
      </header>

      <div className="flex flex-col gap-3 font-mono text-[0.8rem] leading-relaxed text-[var(--text)]">
        {BLOCKS.map((b) => (
          <section
            key={b.code}
            className="rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_50%,transparent)] p-4"
          >
            <p
              className={`mb-2 border-b border-[var(--border)] pb-2 font-departure text-[0.58rem] uppercase tracking-[0.16em] ${TONE[b.tone]}`}
            >
              [ {b.code} ]
            </p>
            <div className="flex flex-col gap-1 [&_code]:rounded-[2px] [&_code]:bg-[var(--bg)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.74rem] [&_code]:text-[var(--cyan)]">
              {b.body}
            </div>
          </section>
        ))}

        <p className="pt-2 text-[0.72rem] text-[var(--text-dim)]">
          <span className="animate-pulse">▊</span> end of log
        </p>
      </div>
    </div>
  );
}
