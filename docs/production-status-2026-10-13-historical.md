# Production hardening status — 13 October 2026

Status: tested code candidate prepared; remote update and production release remain blocked by integration access. The owner explicitly authorized main-branch updates, production release, Worker/Turnstile configuration and contact delivery testing. The GitHub Contents API was retried under that authorization and returned HTTP 403, Resource not accessible by integration. The local Git transport has no authenticated write session; no source was pushed.

## Current live and account state

- A fresh browser inspection of the home and contact pages still shows the original private demonstration, no-email text and `hello@example.invalid` fallback. The production repairs are not live.
- Email Routing for `hello@ezerwright.com` is configured and successfully tested, as confirmed by the owner. Do not repeat routing setup or its completed forwarding test.
- The shared Cloudflare tab remains at the login page. Failed Google sign-in is stopped; no credentials were changed. There is no Cloudflare connector available.

## Prepared code

- Production content/config: real domain and public contact address; removed private-demo and future-AI-service claims from the production pages; preserved the approved $500 offer.
- Dedicated contact Worker and narrow `/api/*` route; no static asset binding needed. Production runtime settings cannot be overwritten by demo builds. Cloudflare Pages refuses demo-mode releases. Real email delivery still requires account configuration.
- Form input limits, duplicate-field and recipient-tampering checks, honeypot, same-origin restriction, hostname/action-checked Turnstile, five attempts per minute per salted IP key, and explicit provider-failure responses.
- Correct MIME line wrapping for long Unicode content, Date and Message-ID headers, and fixed server recipient with visitor Reply-To.
- CSP, HSTS, anti-framing, nosniff, referrer and permissions headers; distinct titles, canonical URLs, sitemap and indexing for production; no-JavaScript email fallback.
- Restricted email deployment configuration generated locally so the private recipient is not published in GitHub. No runtime secrets are included in source.
- Network errors preserve form values and report unconfirmed submission instead of asserting guaranteed failure.
- esbuild is overridden to patched 0.28.1; Wrangler is pinned to 4.150.0 to resolve the deployment-tool advisories. Both production-only and full dependency audit results report zero known vulnerabilities after the update.
- Restored the missing fictional adaptation fixture and font license notices. The 29 protected files were not modified.

## Verification

The full Node suite is run with `npm run qa`; production tests build a temporary fixture with a synthetic key and approved-test privacy flag. These fixtures are deleted after testing. Tests cover structural accessibility (axe, excluding browser-rendered contrast), DOM interaction/error states, local HTTP flow, trust boundaries, adaptation, packaging/hashes, production content/SEO/CSP and the contact-only router. Cloudflare bundling uses `--dry-run` and creates no resources. The suite is not a real mailbox-delivery or live Turnstile test. A local Wrangler runtime smoke test was attempted but startup failed with `uv_interface_addresses` system error 1 in this environment; no API request reached a running Cloudflare simulator. A fresh public MX lookup also timed out; the original lookup and owner screenshot are historical observations, not current DNS verification.

## Remaining access and release order

1. Restore write-capable GitHub integration access to `tituswas/ezerwright-site`; the prepared patch is based on main `6a56cf482c6654886b57e839c344623c81cb63e7`. Inspect the branch head before applying it.
2. Obtain an authenticated Cloudflare session through the supported secure interface, or use the exact remaining settings in `docs/CLOUDFLARE_OWNER_ACTIONS.md`. Do not repeat the failed Google method or change credentials. Keep existing routing, aliases, DNS, hosting and deployment identifiers.
3. Create the free Managed Turnstile widget for `ezerwright.com`. Store only its public key in the Pages build; keep the secret in Worker runtime secrets. The production privacy notice is authorized with the release. A missing real sitekey still blocks frontend production builds.
4. Deploy the free contact Worker with recipient-restricted email, rate binding and runtime secrets. Backend settings derive from production source independently of demo builds. Use `npm run contact:deploy` with the approved destination in the private build environment; do not deploy the tracked placeholder email config directly.
5. Set the existing Pages production build variables and deploy the reviewed source. Preserve the static domain, design and functionality.
6. Verify six public pages, desktop/mobile layout, keyboard/menu/form behavior, console/CSP, redirects/TLS/headers, robots/sitemap, 404 and API rejection paths. Browser-rendered accessibility, mobile layout and live performance remain unverified.
7. Submit one clearly labeled synthetic enquiry through the production form, complete the real challenge, and verify arrival in the approved Gmail inbox with visitor Reply-To. Provider acceptance or HTTP 200 alone is insufficient. The completed forwarding test does not establish contact-form delivery.

## Rollback

Retain the baseline main commit `6a56cf482c6654886b57e839c344623c81cb63e7` and prior Pages deployment. Restore that deployment/build environment if the new static release fails. Remove or disable the narrow contact route if the API fails, preserving the rest of the site. Keep challenge verification and recipient restrictions enabled during troubleshooting. Email Routing is already tested and should remain unchanged.
