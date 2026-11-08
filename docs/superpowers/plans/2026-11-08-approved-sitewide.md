# Approved site-wide Director implementation

> Execute inline; review the complete change before release.

**Goal:** Publish the approved homepage and consistent black/charcoal/red identity throughout the existing agency site.
**Architecture:** Preserve Astro routing, existing site configuration, shared header/footer, contact handling, Project Room and project brief. Add a final agency-only stylesheet; replace homepage presentation using the approved prototype, retaining the tested gallery controller.
**Spec:** Owner-approved Director preview a9abb624, including charcoal approach, sans-serif supporting headings and compact aligned pricing.

## Constraints
- Keep US$500 and US$250/US$250 terms, audit coming-soon status and empty plugin catalog.
- Preserve contact Worker, forms, validation, deployment configuration, SEO and client-template isolation.
- Existing DNS and Cloudflare Pages hosting; publish only verified source.

## Tasks
- [x] Integrate approved homepage and retain tested gallery and briefing behavior.
- [x] Apply shared typography, charcoal surfaces and red actions to services, approach, living, contact, privacy, plugins and audits.
- [x] Run build and complete regression suite; inspect representative desktop/mobile routes and fix observed defects.
- [ ] Fresh review, publish repository changes, verify live homepage and interior pages.

## Review focus
Navigation on narrow screens; readable forms/status; no cream/green plugin surfaces; no large pricing currency misalignment; no changes to audit availability or contact handling.

## Verified release evidence
97/97 regression tests passed. Production-configured build passed with the existing live public Turnstile key. Desktop homepage/services/plugins/audits and 375px services/plugins/contact checked; no horizontal overflow. Existing protected endpoint, gallery controller, Project Room, briefing flow and business terms retained. Review caught stale green ProjectBrief text; corrected and browser-verified. No live enquiry was submitted as part of the visual rollout.
