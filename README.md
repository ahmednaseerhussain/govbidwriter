# GovBidWriter

AI SaaS for US small businesses and government contractors. Upload any RFP and
instantly generate a **compliance matrix**, **proposal outline**, and **first
draft** tailored to your business — plus a capability statement generator,
NAICS finder, email/notification system, and a pSEO content engine for organic
acquisition.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma ·
PostgreSQL (Neon) · DeepSeek (`deepseek-v4-flash`, with full mock fallback) ·
Resend email (with full mock fallback) · Stripe (with full mock fallback).

---

## Quick start

```bash
npm install                  # runs prisma generate automatically
npx prisma migrate deploy    # applies migrations to DATABASE_URL
npm run dev                  # http://localhost:3000
```

You need a `DATABASE_URL` (Postgres — Neon free tier works; see `.env.example`).
**Everything else works without keys**: AI runs in mock mode (realistic
deterministic sample output), email runs in mock mode (logged, never sent), and
billing runs in mock mode (upgrading flips your plan locally, no charge).

> Prefer zero-setup local dev? Switch `prisma/schema.prisma` provider to
> `"sqlite"`, set `DATABASE_URL="file:./dev.db"`, and run `npx prisma db push`.
> The schema is written to be portable (no enums, no Json columns).

Walk the full flow at `/signup`:

1. **Company profile** → save your details (welcome email + nurture sequence start)
2. **Capability statement** → generate from the profile
3. **RFPs → New** → upload a PDF or paste RFP text
4. **Analyze** → summary, deadline (drives reminder emails), evaluation criteria
5. **Extract requirements** → compliance matrix with priorities/risks
6. **Create proposal** → 11-section draft, per-section generation + editing
7. **Billing** → mock-upgrade to Pro to unlock the full matrix + exports
8. **Bell icon** → in-app notification center; **Settings** → email preferences

## Environment variables

Copy `.env.example` to `.env`. Only `DATABASE_URL` is required.

| Variable | Required | Behavior when missing |
| --- | --- | --- |
| `DATABASE_URL` | Yes | — (Postgres connection string) |
| `NEXT_PUBLIC_APP_URL` | Prod | Canonical URLs/sitemap/email links default to localhost |
| `DEEPSEEK_API_KEY` | No | AI runs in **mock mode** (sample outputs) |
| `DEEPSEEK_MODEL` | No | Defaults to `deepseek-v4-flash` |
| `AUTH_SECRET` | Prod | Dev fallback secret used; **required in production** |
| `RESEND_API_KEY` | No | Email runs in **mock mode** (logged to EmailLog, never sent) |
| `EMAIL_FROM` | Prod email | Defaults to `onboarding@resend.dev` (delivers only to the Resend account owner) |
| `ADMIN_EMAIL` | No | No admin signup notifications |
| `CRON_SECRET` | Prod | Email cron route refuses requests in production |
| `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID` | No | Billing runs in **mock mode** |
| `STRIPE_WEBHOOK_SECRET` | No | Webhook endpoint returns 503 |
| `SAM_GOV_API_KEY` | No | Opportunity search not yet wired (models are ready) |

## AI provider

The only runtime provider is **DeepSeek** (`src/lib/ai/deepseek.ts`), called
through the `AIProvider` interface in `src/lib/ai/provider.ts` via DeepSeek's
OpenAI-compatible `/chat/completions` API. JSON workflows (analysis, extraction,
capability statements) run in JSON mode and are validated against zod schemas
(`src/lib/ai/schemas.ts`) with one repair retry. Every call logs token usage and
an estimated cost (`src/lib/ai/usage.ts`, grep server logs for `ai_usage`).
Without `DEEPSEEK_API_KEY`, the deterministic mock (`src/lib/ai/mock.ts`) keeps
every feature working.

## Email & notifications

- **Provider**: Resend via REST (`src/lib/email/provider.ts`); mock mode logs
  instead of sending. Every send is recorded in `EmailLog`.
- **Templates** (`src/lib/email/templates.ts`): welcome, nurture sequence,
  capability statement ready, RFP uploaded / analysis complete / matrix ready,
  proposal draft ready, usage warnings, subscription events, deadline
  reminders, saved-search alerts, admin signup notice.
- **Preferences**: per-category toggles in Settings; non-transactional emails
  carry signed one-click unsubscribe links (`/api/email/unsubscribe`).
- **Sequences**: a nurture drip (day 2 + day 5) is seeded in the DB and
  enrolled on signup.
- **Cron**: `GET /api/cron/process-emails` (Bearer `CRON_SECRET`) advances
  sequences and sends deadline reminders for RFPs due within 3 days.
  `vercel.json` schedules it hourly on Vercel.
- **In-app**: notification center at `/dashboard/notifications` with an unread
  badge in the dashboard header.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |
| `npm test` | Vitest smoke tests |
| `npm run db:push` | Sync schema (prototyping) |
| `npm run db:migrate` | `prisma migrate deploy` (production) |
| `npm run db:studio` | Prisma Studio |

## Deploying to Vercel

1. Provision Postgres (Neon/Vercel Postgres) and set `DATABASE_URL`.
2. Run migrations: `npx prisma migrate deploy` (or add it to the build command:
   `prisma migrate deploy && next build`).
3. Set env vars: `NEXT_PUBLIC_APP_URL`, `AUTH_SECRET`, `CRON_SECRET`, plus
   `DEEPSEEK_API_KEY`, `RESEND_API_KEY`/`EMAIL_FROM`, and Stripe keys as you
   bring each service live.
4. `vercel.json` already schedules the email cron hourly (Vercel sends
   `Authorization: Bearer $CRON_SECRET` automatically when the env var is set).
5. Stripe: create a Pro price, set `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID`,
   point a webhook at `/api/stripe/webhook` for `checkout.session.completed`
   and `customer.subscription.deleted`, set `STRIPE_WEBHOOK_SECRET`.

> Uploads are parsed in memory and only extracted text is stored in the
> database — no persistent disk is needed.

## Seed data

pSEO content (10 industries, 10 states, NAICS guides, blog posts) is curated
**file-based seed data** — `src/lib/seo/data.ts` and `src/lib/seo/blog.ts` —
statically generated at build time with no DB dependency. To add an industry,
state, or NAICS guide, append an entry there; routes and the sitemap pick it up
automatically. The email nurture sequence seeds itself into the database on
first signup.

## What's real vs mocked

| Area | Status |
| --- | --- |
| Auth, profiles, RFP pipeline, proposals, usage limits, notifications | Real |
| PDF text extraction (`pdf-parse`) with paste fallback | Real |
| AI generation | Real with `DEEPSEEK_API_KEY` (`deepseek-v4-flash`); deterministic mock otherwise |
| Email | Real with `RESEND_API_KEY`; mock (logged, never sent) otherwise |
| Stripe checkout + webhook | Real with keys; instant local plan-flip otherwise |
| Exports (proposal Markdown, matrix CSV) | Real (Pro-gated) |
| SAM.gov search | Not yet wired (`SavedSearch`/`SavedOpportunity` models + alert template ready) |

## Security notes

- All dashboard queries filter by the session `userId`; sessions are
  HMAC-signed httpOnly cookies.
- Uploads validated by magic bytes + extension + 10MB cap.
- RFP text is treated as untrusted in prompts (delimited, injection
  instructions) and all structured AI output is zod-validated.
- AI generation, public tools, uploads, and auth are rate-limited.
- Unsubscribe links are HMAC-signed; the email cron requires `CRON_SECRET`.

## Disclaimer

GovBidWriter generates draft content and checklists for informational
purposes. Users must verify all requirements against the official solicitation
before submission.
