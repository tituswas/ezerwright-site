# Canonical host redirects and release preparation

Status, 16 October 2026: the owner confirms production is successfully deployed and actual contact-form delivery works. Preserve that system. This document prepares a separate owner-reviewed redirect change; **no dashboard, DNS, domain, Worker, credential or production change is authorized by this task**.

## Build correction

Cloudflare Pages [redirect documentation](https://developers.cloudflare.com/pages/configuration/redirects/) defines a source as a file path and excludes domain-level redirects. The removed absolute-host sources were invalid. `scripts/build.mjs` now emits no `_redirects` file. Its clean build removes stale output first. No `/*` fallback, Pages Function, middleware or Worker redirect replaces those entries; canonical paths continue serving normally. Existing SEO/canonical URLs remain intact. Two independent production fixture builds assert `_redirects` is absent.

## Owner-only configuration, after separate approval

Use **account-level Bulk Redirects**, following Cloudflare's [www guide](https://developers.cloudflare.com/pages/how-to/www-redirect/), [Pages-host guide](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/) and [dashboard procedure](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/create-dashboard/). Do not try to match `pages.dev` inside the `ezerwright.com` zone's Single Redirects.

First inspect existing redirect rules/lists for duplicates, apex-to-www rules or loops. Keep the working apex custom domain `ezerwright.com` attached and active in the existing `ezerwright-site` Pages project. Preserve the account, project and its current deployment. Do not recreate domains or alter nameservers, apex records, MX/TXT/email records, Worker routes or secrets.

1. In that Cloudflare account, open **Bulk redirects → Bulk Redirect Lists → Create Bulk Redirect List**. Name it `ezerwright_canonical_hosts` (or review/update an existing equivalent instead of duplicating it).
2. Manually add exactly these entries, without a wildcard, scheme or query string in either source:

   | Source URL | Target URL | Status |
   | --- | --- | --- |
   | `www.ezerwright.com/` | `https://ezerwright.com/` | `301` |
   | `ezerwright-site.pages.dev/` | `https://ezerwright.com/` | `301` |

3. Expand **Edit parameters** on **each** entry. Enable **Preserve query string**, **Subpath matching** and **Preserve path suffix**. Set **Include subdomains = off**. This deliberately covers only the two named hosts; branch/hash preview subdomains remain unchanged. Omitting a source scheme matches HTTP and HTTPS. See the [parameter reference](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/parameters/).
4. Continue to **Redirect Rules**, name the rule `EZERWRIGHT canonical hosts`, select the list and retain the wizard-generated expression/key. Use **Save as Draft** during review; a list alone does not activate redirects. **Save and Deploy** is a production-affecting owner action requiring separate approval, not a step performed here.

### DNS and TLS prerequisites

- `www.ezerwright.com` traffic must pass through Cloudflare (orange-cloud **Proxied**) and have valid edge TLS coverage before HTTPS redirects can work. Preserve an existing suitable proxied `www` record/target. Do not create a duplicate or overwrite a working record blindly. If no record exists and the owner approves a redirect-only setup, Cloudflare's www guide specifies **A**, name **www**, IPv4 **192.0.2.1**, **Proxied**. This reserved placeholder is for edge redirecting, not an origin server. Wait for DNS and TLS readiness before acceptance testing.
- `ezerwright-site.pages.dev` is Cloudflare-managed. Do **not** add a `pages.dev` DNS record to the `ezerwright.com` zone or attempt to change its DNS. Use the owning Pages account's Bulk Redirect rule; the working apex custom domain must be attached to that project.

### Expected results after authorized activation

| Request | Expected 301 Location |
| --- | --- |
| `https://www.ezerwright.com/plugins/services/?topic=setup&from=review` | `https://ezerwright.com/plugins/services/?topic=setup&from=review` |
| `http://ezerwright-site.pages.dev/contact/?service=other` | `https://ezerwright.com/contact/?service=other` |
| Either source hostname with `/` | `https://ezerwright.com/` |

Apex URLs must not match these rules. Do not introduce an apex catch-all. A 301 may turn an alias-host POST into GET: the existing form must continue posting directly to the canonical same-origin `/api/contact`, with no Worker change.

## Production verification checklist — owner, after authorization only

- [ ] Confirm the release commit, current production branch/automatic deployment controls and rollback deployment before merging. Treat merge as potentially deploying production.
- [ ] Confirm the built artifact has no `_redirects`, and the Pages build accepts it. Local tests do not prove hosted acceptance.
- [ ] Review the two draft entries, exact hostnames, enabled path/query options, disabled subdomain matching, rule ordering and TLS/DNS prerequisites before activating any rule.
- [ ] With GET/HEAD requests, check both aliases over HTTP/HTTPS: `/`, nested paths, and query strings. Inspect status/Location, then follow to a working canonical page. Check for redirect loops; allow for separate HTTP-to-HTTPS behavior already configured at the edge.
- [ ] Verify all eight canonical agency routes, header/footer navigation, canonicals, robots, sitemap, security headers and normal 404 behavior. Check a preview hostname remains unaffected.
- [ ] Verify contact UI and its same-origin action without submitting. Preserve the already confirmed delivery setup; do not repeat email routing or send another email without separate authorization.

## Risks, readiness and rollback

The source correction is suitable for code review once local QA passes. It does not activate host redirects. Until approved account rules are configured, aliases may continue serving duplicate content; canonical metadata remains correct. Broad host matching, disabling path/query preservation, TLS gaps or conflicting rules can break links. Permanent redirects can remain cached in browsers.

The review commit uses Cloudflare's documented `[CF-Pages-Skip]` convention. It is not a permanent safeguard and must not be assumed to protect a future merge/squash commit. **Hold production-affecting merge/release until the owner explicitly approves its effects and verifies current deployment controls.** The prior failed-check observations are historical, superseded for live-system status by the owner's confirmed successful deployment; this task does not retry hosted builds.

If later rule activation causes a problem, the owner can disable only the new rule and restore its prior rule configuration; do not reset working DNS or the contact Worker. If a later static release regresses, restore the known-good Pages deployment through the approved release process. Do not restore the invalid `_redirects` lines.
