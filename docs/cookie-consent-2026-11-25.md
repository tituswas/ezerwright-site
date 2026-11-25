# Cookie consent and optional tracking controls — 25 November 2026

## Scope and rollback

The owner requested consent controls on ezerwright.com and no optional visitor tracking without acceptance. This release is limited to ezerwright.com. Baseline / rollback is `a964c12b75557df7fe3124ee44f366b832fecb4f` (main, Office Bid Studio terms). It preserves the service offer, Office Bid Studio pricing/link, contact endpoint, required email/message, optional name, email delivery and existing local project interactions.

## Behavior

- Every agency route has an unobtrusive consent panel with equally styled **Accept optional** and **Reject optional** buttons, a cookie policy link, and a persistent **Cookie settings** footer entry.
- No optional analytics, advertising or session-replay service is configured. Accepting records a preference only; it does not install or start tracking. A new purpose/provider must change the policy version and request a fresh choice.
- Before a choice, the consent module writes nothing. After an explicit choice, `ezerwright-cookie-choice-v1` contains only choice, policy version and choice timestamp in localStorage for up to 180 days. It is not sent to the server and is not an identifier.
- Rejecting or changing the choice preserves requested feature and form state. Invalid, expired, future, old-version, missing and inaccessible storage fails closed. Cross-tab changes and back-forward navigation recheck the choice.
- The contact page makes no Turnstile request merely from viewing or editing the form. **Enable spam verification** explicitly loads the security check, with a separate explanation and email fallback. Server-side challenge verification remains required. No enquiry is sent before a user submits and has a challenge response.
- Cloudflare analytics script sources are excluded from CSP. `connect-src` allows the exact same-origin `/api/contact` endpoint and Cloudflare challenge service, excluding same-origin `/cdn-cgi/rum`.
- Generated HTML URLs receive `Cache-Control: public, max-age=0, must-revalidate, no-transform` to stop hosting-layer script injection. Existing immutable caching of font/CSS assets is preserved. Unknown 404 URLs retain the global restrictive CSP; hosting dashboard analytics should remain disabled.
- Static responses and contact responses request expiry of the `cf-nel` browser error-reporting policy with NEL and Report-To `max_age: 0`. The final live edge headers must be checked: an account-level injection could otherwise override source headers.
- `Referrer-Policy: no-referrer` avoids sending page/query URLs to external destinations.

## Verification completed in source

`npm ci --ignore-scripts` and `npm run qa` completed successfully: **115 tests passed, zero failed**. Coverage includes default-off behavior, accept/reject, reload, withdrawal, cross-tab and navigation changes, expiry/version corruption, inaccessible storage, no unexpected requests, preserved unrelated storage, delayed security script loading, failed-load retry, synthetic verified submission, production HTML/script/header checks, contact server validation and existing route/feature regressions.

Structural axe checks remain part of the suite. They do not prove visual contrast, assistive-technology behavior or a real-device audit. The existing all-JavaScript budget remains under 20 KiB and compressed per-route CSS remains under 12 KiB. The raw per-route CSS ceiling is 58 KiB (previously 56 KiB) to accommodate the shared consent panel.

## Deployment and live verification handover

The prepared branch must pass independent review and publication before live success is claimed. Verify the live main Pages deployment and separate contact Worker for the exact merged commit. In fresh browser visits check Home, Contact, Privacy, Office Bid Studio and another interior route for consent controls, no optional scripts/requests before a choice, equal rejection, saved/reopened choices, and mobile/desktop layout. Check final Cache-Control, CSP, Referrer-Policy and NEL/Report-To headers. Record any hosting setting that cannot be verified or changed.

No production enquiry, test email, payment or account creation is part of this release's tests. Necessary hosting/security request processing remains distinct from optional browsing analytics; the cookie notice does not claim that web infrastructure processes no information.

## Primary technical references

- Cloudflare Web Analytics automatic setup: https://developers.cloudflare.com/web-analytics/get-started/
- Cloudflare Web Analytics troubleshooting: https://developers.cloudflare.com/web-analytics/faq/
- Pages response headers: https://developers.cloudflare.com/pages/configuration/headers/
- Network Error Logging configuration: https://developers.cloudflare.com/network-error-logging/
- Turnstile explicit rendering: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
