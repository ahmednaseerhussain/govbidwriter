# GovBidWriter — TODO

## MVP (this build)

- [x] Project scaffold (Next 15, TS, Tailwind, Prisma)
- [x] `.claude/agents/` subagent team
- [x] Prisma schema (User, CompanyProfile, RfpDocument, RfpAnalysis, RfpRequirement, Proposal, ProposalSection, GeneratedTool, Subscription, UsageLog, SavedOpportunity)
- [ ] Auth (signup/login, signed session cookie, requireUser)
- [ ] AI provider abstraction (Fable 5 + mock) with zod-validated JSON outputs
- [ ] Company profile builder
- [ ] Capability statement generator (dashboard + free public tool)
- [ ] RFP upload (PDF + paste fallback) and analyzer
- [ ] Requirement extraction + compliance matrix (+ CSV export)
- [ ] Proposal generator + section editor (+ Markdown export)
- [ ] Billing: plans, usage limits, Stripe stubs, mock upgrade flow
- [ ] Free tools: capability statement, compliance matrix preview, NAICS finder
- [ ] pSEO: /government-contracts, industry pages, industry/state pages, NAICS pages
- [ ] /templates, /blog (3 seed posts), /government-contract-proposal-template
- [ ] sitemap.ts, robots.ts, JSON-LD, metadata
- [ ] README + .env.example + deploy guide
- [ ] typecheck/lint/build green; smoke tests

## Post-launch backlog (deliberately cut from MVP)

- DOCX export (currently Markdown + CSV; `docx` npm package is the candidate)
- Real Stripe checkout + webhook fulfillment (stubs in place)
- SAM.gov live opportunity search (SavedOpportunity model ready; needs SAM_GOV_API_KEY integration)
- Email (Resend): welcome, deadline reminders
- Password reset flow
- Team seats / multi-user orgs
- Proposal review/score feature (prompt template exists; UI deferred)
- PDF page-number-accurate citations (current page references are best-effort from text)
- More pSEO scale (agencies, certifications pages) — only after the seed pages index well
- Rate limiting via Redis/Upstash (in-memory abstraction in place)
- Real NAICS dataset (full 1,000+ codes) — seed set of common codes shipped
