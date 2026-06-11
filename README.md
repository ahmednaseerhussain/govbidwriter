# GovBidWriter

AI SaaS for US small businesses and government contractors. Upload any RFP and
instantly generate a **compliance matrix**, **proposal outline**, and **first
draft** tailored to your business — plus a capability statement generator,
NAICS finder, and pSEO content engine for organic acquisition.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma ·
SQLite (dev) / PostgreSQL (prod) · Fable 5 via Anthropic API (with full mock
fallback) · Stripe (with full mock fallback).

---

## Quick start (zero keys required)

```bash
npm install            # runs prisma generate automatically
npx prisma db push     # creates prisma/dev.db (SQLite)
npm run dev            # http://localhost:3000
```

That's it. **Every feature works without any API keys**: the AI provider runs
in mock mode (realistic deterministic sample output) and billing runs in mock
mode (upgrading flips your plan locally, no charge). Create an account at
`/signup` and walk the full flow:

1. **Company profile** → save your details
2. **Capability statement** → generate from the profile
3. **RFPs → New** → upload a PDF or paste RFP text
4. **Analyze** → summary, deadline, evaluation criteria
5. **Extract requirements** → compliance matrix with priorities/risks
6. **Create proposal** → 11-section draft, per-section generation + editing
7. **Billing** → mock-upgrade to Pro to unlock the full matrix + exports

## Environment variables

Copy `.env.example` to `.env`. Everything is optional in dev except
`DATABASE_URL` (defaults to SQLite).

| Variable | Required | Behavior when missing |
| --- | --- | --- |
| `DATABASE_URL` | Yes | — (use `file:./dev.db` locally) |
| `NEXT_PUBLIC_APP_URL` | Prod | Canonical URLs/sitemap default to localhost |
| `FABLE_API_KEY` | No | AI runs in **mock mode** (sample outputs) |
| `AUTH_SECRET` | Prod | Dev fallback secret used; **required in production** |
| `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID` | No | Billing runs in **mock mode** |
| `STRIPE_WEBHOOK_SECRET` | No | Webhook endpoint returns 503 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Unused until client-side Stripe is added |
| `SAM_GOV_API_KEY` | No | Opportunity search not yet wired (model is ready) |
| `RESEND_API_KEY` | No | Email not yet wired |

Generate an `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest smoke tests (schemas, limits, auth, exports, mock AI) |
| `npm run db:push` | Sync schema to the database (dev) |
| `npm run db:migrate` | `prisma migrate deploy` (production) |
| `npm run db:studio` | Prisma Studio |

## Deploying to Vercel

1. **Provision Postgres** (Vercel Postgres, Neon, or Supabase) and copy the
   connection string.
2. **Switch the Prisma provider** — in `prisma/schema.prisma` change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   Then create the initial migration locally against your Postgres URL:
   ```bash
   DATABASE_URL="postgresql://..." npx prisma migrate dev --name init
   ```
   Commit the generated `prisma/migrations/` folder.
3. **Import the repo in Vercel** (framework preset: Next.js — defaults work;
   `postinstall` runs `prisma generate`).
4. **Set environment variables** in Vercel:
   - `DATABASE_URL` (Postgres)
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://govbidwriter.com`)
   - `AUTH_SECRET` (required)
   - `FABLE_API_KEY` (for real AI; omit to demo in mock mode)
   - Stripe keys when ready (see below)
5. **Run migrations** on deploy — add a Vercel build command override:
   `prisma migrate deploy && next build` (or run it once via
   `npx prisma migrate deploy` with the prod `DATABASE_URL`).
6. **Stripe (optional at launch):** create a Pro product/price, set
   `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID`, add a webhook endpoint
   `https://<domain>/api/stripe/webhook` for `checkout.session.completed` and
   `customer.subscription.deleted`, and set `STRIPE_WEBHOOK_SECRET`.

> **Vercel note:** uploads are parsed in memory and only extracted text is
> stored in the database — no persistent disk is needed.

## What's real vs mocked

| Area | Status |
| --- | --- |
| Auth (scrypt + signed cookies), profiles, RFP pipeline, proposals, usage limits | Real |
| PDF text extraction (`pdf-parse`) with paste fallback | Real |
| AI generation | Real with `FABLE_API_KEY` (model `claude-fable-5`); deterministic mock otherwise |
| Stripe checkout + webhook | Real with keys; instant local plan-flip otherwise |
| Exports (proposal Markdown, matrix CSV) | Real (Pro-gated) |
| SAM.gov search, email | Not yet wired (stub-ready; see TODO.md) |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the folder layout, data flow, and
key decisions, and [TODO.md](./TODO.md) for the post-launch backlog. The
`.claude/agents/` directory defines a 10-role engineering team for Claude Code.

## Security notes

- All dashboard queries filter by the session `userId`; sessions are
  HMAC-signed httpOnly cookies.
- Uploads are validated by magic bytes + extension + 10MB cap.
- RFP text is treated as untrusted in prompts (delimited, with explicit
  injection instructions) and all structured AI output is zod-validated.
- AI generation and public tools are rate-limited (in-memory; swap for Redis
  at scale).

## Disclaimer

GovBidWriter generates draft content and checklists for informational
purposes. Users must verify all requirements against the official solicitation
before submission.
