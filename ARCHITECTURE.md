# GovBidWriter — Architecture

AI SaaS for US small businesses pursuing government contracts: capability statements,
RFP analysis, requirement extraction, compliance matrices, and proposal drafts.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript | Server components by default, server actions for mutations |
| Styling | Tailwind CSS + shadcn/ui-style components | `src/components/ui/` |
| Database | Prisma ORM — SQLite (dev) / PostgreSQL (prod) | Portable schema: no enums, no Json columns |
| AI | Provider abstraction — Fable 5 (Anthropic API) primary, mock fallback | `src/lib/ai/` |
| Billing | Stripe with full mock mode | `src/lib/billing/` |
| Auth | Credentials (scrypt) + HMAC-signed session cookie | `src/lib/auth/` — swappable for NextAuth later |
| PDF | `pdf-parse` behind an abstraction, paste-text fallback | `src/lib/pdf/` |
| Deploy | Vercel | No persistent disk: extracted text stored in DB, never files |

## Directory layout

```
src/
  app/
    (marketing)/            # public + SEO pages (landing, pricing, tools, pSEO)
      page.tsx              # /
      pricing/
      tools/                # free tools (lead magnets)
      government-contracts/ # pSEO: industry + industry/state pages
      naics/[code]/         # pSEO: NAICS pages
      templates/  blog/  government-contract-proposal-template/
    (auth)/login  (auth)/signup
    dashboard/              # authenticated app
      company-profile/  rfps/  rfps/new  rfps/[id]/
      proposals/  proposals/[id]/  settings/  billing/
    api/
      upload/rfp/           # multipart PDF upload (route handler)
      export/               # markdown/CSV downloads
      stripe/webhook/       # Stripe webhook stub
    sitemap.ts  robots.ts
  components/
    ui/                     # Button, Card, Input, Table, Badge, ...
    marketing/  dashboard/  # composed components
  lib/
    ai/                     # provider.ts, fable.ts, mock.ts, schemas.ts, prompts/
    auth/                   # session.ts (signed cookies), password.ts, actions
    billing/                # plans.ts (limits), stripe.ts (stubs + mock)
    pdf/                    # extract.ts
    seo/                    # pSEO seed data + metadata/JSON-LD helpers
    db.ts  usage.ts  rate-limit.ts  json.ts  utils.ts
prisma/schema.prisma
```

## Key decisions

1. **Mock-first external services.** Every external dependency (Fable 5, Stripe,
   SAM.gov, Resend) checks its env key at runtime and degrades to a working mock.
   `npm run dev` and `npm run build` succeed with zero env vars.
2. **JSON-as-String columns.** SQLite (dev) and Postgres (prod) portability means
   no Prisma enums/Json. Arrays are stored as JSON strings and validated with zod
   helpers in `src/lib/json.ts`.
3. **AI calls only via `AIProvider`.** `getAIProvider()` returns `FableProvider`
   when `FABLE_API_KEY` is set, else `MockProvider`. Structured outputs are
   validated against zod schemas with one repair retry.
4. **Prompt injection defense.** RFP text is untrusted: wrapped in delimiters,
   the model is instructed to treat it as data, and output is schema-validated.
5. **Usage gating server-side.** Plan limits in `src/lib/billing/plans.ts`,
   enforcement in `src/lib/usage.ts` before every AI call. Free: 3 generations/mo,
   1 RFP upload, 5-row matrix preview. Pro: high limits + exports.
6. **pSEO from seed data, statically generated.** Industry/state/NAICS pages use
   `generateStaticParams` over curated seed data in `src/lib/seo/data.ts` — no DB
   reads at build time.
7. **Stateless sessions.** `userId.expiry.hmac` cookie signed with AUTH_SECRET;
   no session table. `requireUser()` guards all dashboard actions.

## Data flow (core loop)

```
Upload PDF / paste text ──> RfpDocument (text in DB)
        │
        ▼ analyze (AI)            ▼ extract (AI)
   RfpAnalysis              RfpRequirement[] ──> Compliance Matrix (table + CSV)
        │
        ▼ generate (AI, section by section)
   Proposal + ProposalSection[] ──> Editor ──> Markdown export
```
