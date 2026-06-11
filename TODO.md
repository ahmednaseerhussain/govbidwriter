# GovBidWriter — TODO

## MVP (this build)

- [x] Project scaffold (Next 15, TS, Tailwind, Prisma)
- [x] `.claude/agents/` subagent team
- [x] Prisma schema (User, CompanyProfile, RfpDocument, RfpAnalysis, RfpRequirement, Proposal, ProposalSection, GeneratedTool, Subscription, UsageLog, SavedOpportunity)
- [x] Auth (signup/login, signed session cookie, requireUser)
- [x] AI provider abstraction (Fable 5 + mock) with zod-validated JSON outputs
- [x] Company profile builder
- [x] Capability statement generator (dashboard + free public tool)
- [x] RFP upload (PDF + paste fallback) and analyzer
- [x] Requirement extraction + compliance matrix (+ CSV export)
- [x] Proposal generator + section editor (+ Markdown export)
- [x] Billing: plans, usage limits, Stripe stubs, mock upgrade flow
- [x] Free tools: capability statement, compliance matrix preview, NAICS finder
- [x] pSEO: /government-contracts, industry pages, industry/state pages, NAICS pages
- [x] /templates, /blog (3 seed posts), /government-contract-proposal-template
- [x] sitemap.ts, robots.ts, JSON-LD, metadata
- [x] README + .env.example + deploy guide
- [x] typecheck/lint/build green; smoke tests (18 passing)

## Phase 2 (this build)

- [x] AI provider switched to DeepSeek (`deepseek-v4-flash`) with mock fallback + usage/cost logging
- [x] Database on PostgreSQL (Neon) with migrations
- [x] Email system: Resend provider + mock, 14 templates, EmailLog, per-category preferences,
      signed unsubscribe links, nurture sequence (DB-seeded), cron route, Vercel cron config
- [x] Email triggers: signup, capability statement, RFP upload/analysis/matrix, first proposal
      section, usage warnings (80%/100%), subscription upgrade/cancel (mock + Stripe webhook),
      deadline reminders (3-day window), admin signup notice
- [x] In-app notification center with unread badge + mark-all-read + preferences UI

## Post-launch backlog (deliberately cut from MVP)

- DOCX export (currently Markdown + CSV; `docx` npm package is the candidate)
- Real Stripe checkout + webhook fulfillment end-to-end test (code paths in place)
- SAM.gov live opportunity search (SavedSearch/SavedOpportunity models + alert email template ready; needs SAM_GOV_API_KEY integration + UI)
- Contact form page (admin email template pattern is in place)
- Password reset flow
- Team seats / multi-user orgs
- Proposal review/score feature (prompt template exists; UI deferred)
- PDF page-number-accurate citations (current page references are best-effort from text)
- More pSEO scale (agencies, certifications pages) — only after the seed pages index well
- Rate limiting via Redis/Upstash (in-memory abstraction in place)
- Real NAICS dataset (full 1,000+ codes) — seed set of common codes shipped
