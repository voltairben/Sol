# Project Sol

Portal site for **SOL_DNB** — a Dutch Drum & Bass DJ and livestreamer. A single-screen
"Terminal Club" dashboard: watch the stream (Kick / Twitch), submit and upvote track
requests in realtime, and see when a broadcast goes live — no page refresh.

## Stack

Next.js 16 (App Router) · Tailwind v4 · Supabase (Postgres + Realtime + Auth) ·
iron-session · Resend · `motion` · Web Audio API

## Local dev

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase + secrets block
npm run db:check             # validate the Supabase wiring
npm run dev                  # http://localhost:3000
```

| Script | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `npm run lint` | production build / lint |
| `npm test` | pure-logic unit tests (`scripts/**/*.test.mjs`) |
| `npm run db:check` | end-to-end Supabase connection check |

## Channels

- Kick — <https://kick.com/SOL_DNB>
- Twitch — <https://www.twitch.tv/sol_dnb1>
- Instagram — <https://www.instagram.com/sol_dnb/>

## Layout

- `src/app/` — routes (`/`, `/admin`, `/auth/callback`, `/api/*`) + `proxy.ts` (Next 16 middleware)
- `src/components/` — feature folders: `console/` `hub/` `control/` `layout/` `effects/` `links/` `newsletter/` `auth/` `stream/` `ui/`
- `src/lib/` — Supabase clients, synth engine, admin session, helpers
- `supabase/migrations/` — schema
