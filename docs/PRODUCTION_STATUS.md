# Production status — 10 November 2026

The earlier 13 October deployment-blocker report is preserved in `production-status-2026-10-13-historical.md`; it is historical and does not describe today's live site.

The current production QA candidate corrects stale commercial copy, light-showcase contrast, red CTA paragraph contrast, prohibited cream UI surfaces, required-field validation feedback and small standalone link hit areas while preserving the Director design and real contact architecture.

Baseline and remote rollback branch: `132cbc12b57951e76296435b92dfcab5a5c02ff9`, `backup/before-production-qa-20261110`.

Verified in source/staging: 99 passing build/regression tests; both Cloudflare dry bundles; 78 exact-width rendered cases with zero axe violations and no document overflow; complete 390/1280 JPGs for all 13 routes; synthetic form/menu/gallery/Project Room browser checks. See `qa-2026-11-10.md` for the defect register, method, evidence and explicit limits.

Publication status: candidate pending branch/CI/release verification. No live success, mailbox arrival, real Turnstile completion, production Core Web Vitals or Lighthouse score is claimed. Email routing is already configured/tested by the owner and remains unchanged. Account-level Pages/Worker settings and secrets are not exposed in this session; preserve their existing values.
