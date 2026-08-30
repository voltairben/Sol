import type { ReactNode } from "react";
import { CONTACT_EMAIL, SUPABASE_REGION } from "@/lib/constants";

export type PrivacyTone = "cyan" | "persimmon" | "dim";
export type PrivacyBlock = { code: string; tone: PrivacyTone; body: ReactNode };

export interface PrivacyCopy {
  eyebrow: string;
  title: string;
  lede: string;
  endOfLog: string;
  blocks: PrivacyBlock[];
}

const Mail = () => (
  <a
    href={`mailto:${CONTACT_EMAIL}`}
    className="text-[var(--cyan)] underline underline-offset-2"
  >
    {CONTACT_EMAIL}
  </a>
);

const AboutLink = ({ label }: { label: string }) => (
  <a href="/about" className="text-[var(--cyan)] underline underline-offset-2">
    {label}
  </a>
);

// ── English ──────────────────────────────────────────────────────────
export const PRIVACY_EN: PrivacyCopy = {
  eyebrow: "[ compliance_manifest ]",
  title: "[ system_log // privacy_&_security_manifest ]",
  lede: "Privacy-first by construction. Read top to bottom.",
  endOfLog: "end of log",
  blocks: [
    {
      code: "LOG_01 // NO_TRACKING",
      tone: "cyan",
      body: (
        <>
          <p>
            No advertising pixels, no fingerprinting, no third-party trackers, no
            behavioural profiles. We do not sell or share data.
          </p>
          <p className="mt-2">
            The only measurement is Vercel Web Analytics — aggregate, cookieless
            page counts with no cross-site identifiers. It cannot follow you
            around the web and builds no profile of you.
          </p>
        </>
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
            Signing in to suggest or upvote a track uses Supabase Auth with
            Twitch or Discord OAuth. This sets an essential session cookie and
            stores a session token in localStorage so you stay logged in across
            pages — standard, strictly-necessary session handling, only active
            once you choose to sign in.
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
          configured, to store you as a contact. Every email carries an
          unsubscribe link; unsubscribing removes you from the list. We use your
          address for nothing but go-live and set announcements.
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
          display name. This is a one-way notification; the channel is not
          public.
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
            You can request access to, correction of, or deletion of any data
            tied to your account, and you can object to processing or ask for a
            copy. Deleting your account removes your profile data; your track
            requests and votes cascade-delete with it.
          </p>
          <p className="mt-2">
            To make a request, email <Mail /> or reach SOL_DNB through the
            channels on the <AboutLink label="/about" /> page — we respond within
            48 hours. You also have the right to complain to your local data
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
          Material changes to this manifest are posted on this page. An English
          and a Dutch version are kept in sync — switch with the EN / NL toggle
          in the header. Last update: 30 August 2026.
        </p>
      ),
    },
  ],
};

// ── Nederlands ───────────────────────────────────────────────────────
export const PRIVACY_NL: PrivacyCopy = {
  eyebrow: "[ nalevings_manifest ]",
  title: "[ systeem_log // privacy_&_beveiligings_manifest ]",
  lede: "Privacy-first vanaf de fundering. Lees van boven naar beneden.",
  endOfLog: "einde log",
  blocks: [
    {
      code: "LOG_01 // GEEN_TRACKING",
      tone: "cyan",
      body: (
        <>
          <p>
            Geen advertentiepixels, geen fingerprinting, geen trackers van
            derden, geen gedragsprofielen. We verkopen of delen geen gegevens.
          </p>
          <p className="mt-2">
            De enige meting is Vercel Web Analytics — geaggregeerde, cookie-loze
            paginatellingen zonder identifiers die je over websites heen volgen.
            Het kan je niet volgen op het web en bouwt geen profiel van je op.
          </p>
        </>
      ),
    },
    {
      code: "LOG_02 // LOKALE_STATE",
      tone: "cyan",
      body: (
        <>
          <p>
            Een handvol sleutels staat in de localStorage van je browser, puur om
            functionele keuzes te onthouden. Ze worden nooit naar ons verstuurd:
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            <li>
              <span className="text-[var(--persimmon)]">›</span>{" "}
              <code>sol_consent</code> — je antwoord op de feed-toestemmingspoort
            </li>
            <li>
              <span className="text-[var(--persimmon)]">›</span>{" "}
              <code>sol:lang</code> — voorkeur EN / NL
            </li>
            <li>
              <span className="text-[var(--persimmon)]">›</span>{" "}
              <code>sol:player</code> — keuze KICK of TWITCH
            </li>
            <li>
              <span className="text-[var(--persimmon)]">›</span>{" "}
              <code>sol:audio</code> — console-SFX aan / uit
            </li>
          </ul>
          <p className="mt-2">
            De &ldquo;al afgespeeld&rdquo;-vlag van het bootscherm staat alleen in
            het geheugen en reset bij elke volledige paginalading. Site-data
            wissen verwijdert al het bovenstaande.
          </p>
        </>
      ),
    },
    {
      code: "LOG_03 // SESSIE_AUTH",
      tone: "cyan",
      body: (
        <>
          <p>
            Inloggen om een track voor te stellen of te upvoten verloopt via
            Supabase Auth met Twitch- of Discord-OAuth. Dit plaatst een
            essentiële sessie-cookie en bewaart een sessietoken in localStorage
            zodat je ingelogd blijft tussen pagina&apos;s — standaard, strikt
            noodzakelijke sessie-afhandeling, alleen actief zodra je zelf kiest
            om in te loggen.
          </p>
          <p className="mt-2">
            Van de provider ontvangen we je <em>weergavenaam</em> en je{" "}
            <em>avatar-URL</em>. Die bewaren we bij de trackverzoeken en stemmen
            die je aanmaakt, gekoppeld aan je account-id. Verder niets.
          </p>
        </>
      ),
    },
    {
      code: "LOG_04 // EXTERNE_EMBEDS",
      tone: "persimmon",
      body: (
        <>
          <p>
            De Twitch- en Kick-spelers zijn iframes vanaf <code>twitch.tv</code> /{" "}
            <code>kick.com</code>. Zodra ze laden plaatsen ze hun eigen cookies en
            gelden hun eigen privacyverklaringen.
          </p>
          <p className="mt-2">
            Deze embeds zijn <strong>standaard geblokkeerd</strong>. Er laadt
            niets van Twitch of Kick totdat je expliciet{" "}
            <code>INITIALIZE SIGNAL TRANS-FEED</code> kiest op de
            boot-toestemmingspoort (of op de geblokkeerde-feed-kaart bij de
            stream klikt). Je kunt die keuze altijd intrekken via{" "}
            <code>[ COOKIES ]</code> in de footer.
          </p>
        </>
      ),
    },
    {
      code: "LOG_05 // NIEUWSBRIEF",
      tone: "cyan",
      body: (
        <p>
          Als je je e-mailadres invult bij de aanmeldprompt, gaat het naar Resend
          (onze e-mailprovider) voor een bevestigingsmail en, als er een
          mailinglijst is ingesteld, om je als contact op te slaan. Elke e-mail
          bevat een afmeldlink; afmelden haalt je van de lijst. We gebruiken je
          adres uitsluitend voor go-live- en set-aankondigingen.
        </p>
      ),
    },
    {
      code: "LOG_06 // DISCORD_RELAY",
      tone: "dim",
      body: (
        <p>
          Indien ingeschakeld wordt een geslaagd trackverzoek doorgestuurd naar
          het besloten teamkanaal van SOL_DNB op Discord — de artiest, de titel
          en je weergavenaam. Dit is eenrichtingsverkeer; het kanaal is niet
          openbaar.
        </p>
      ),
    },
    {
      code: "LOG_07 // INFRASTRUCTUUR",
      tone: "dim",
      body: (
        <>
          <p>
            De site draait op Vercel, dat standaard request-logs bewaart (IP,
            user-agent, tijdstip) voor beheer en beveiliging. De database en
            realtime-laag zijn Supabase, gehost in de EU (
            <code>{SUPABASE_REGION}</code>).
          </p>
          <p className="mt-2">
            Rechtsgrond: essentiële cookies en sessie-afhandeling rusten op
            gerechtvaardigd belang / uitvoering van de dienst die je hebt
            aangevraagd; embeds van derden en de nieuwsbrief rusten op jouw
            toestemming.
          </p>
        </>
      ),
    },
    {
      code: "LOG_08 // JOUW_RECHTEN",
      tone: "persimmon",
      body: (
        <>
          <p>
            Je hebt het recht om alle gegevens die aan je account gekoppeld zijn
            in te zien, te corrigeren of te laten verwijderen, en je kunt bezwaar
            maken tegen verwerking of een kopie opvragen. Je account verwijderen
            wist je profielgegevens; je trackverzoeken en stemmen verdwijnen
            automatisch mee.
          </p>
          <p className="mt-2">
            Stuur een verzoek naar <Mail /> of bereik SOL_DNB via de kanalen op
            de <AboutLink label="/about" />-pagina — we reageren binnen 48 uur. Je
            hebt ook het recht om een klacht in te dienen bij de Autoriteit
            Persoonsgegevens.
          </p>
        </>
      ),
    },
    {
      code: "LOG_09 // BEWAARTERMIJN",
      tone: "dim",
      body: (
        <p>
          Trackverzoeken blijven staan tot SOL_DNB ze opschoont. Account- en
          sessiegegevens blijven tot je je account verwijdert of je sessie
          verloopt. Nieuwsbrief-contacten blijven tot je je afmeldt.
          Browseropslag blijft tot je die wist.
        </p>
      ),
    },
    {
      code: "LOG_10 // WIJZIGINGEN",
      tone: "dim",
      body: (
        <p>
          Wezenlijke wijzigingen aan dit manifest worden op deze pagina geplaatst.
          Er zijn een Nederlandse en een Engelse versie die gelijk lopen — wissel
          met de EN / NL-schakelaar in de header. Laatste update: 30 augustus
          2026.
        </p>
      ),
    },
  ],
};
