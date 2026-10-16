# EZERWRIGHT Plugins review

Implemented on `feat/plugins-catalog`, based on `c0e81e7`. No merge or manual deployment authorized or performed. **Merge recommendation: hold pending owner review of Cloudflare deployment controls and failed hosted checks; see [deployment assessment](DEPLOYMENT.md).**

## Verification

- Node 24.19.0 satisfies the package engine (`>=22.19.0`).
- `npm ci --ignore-scripts`: passed, lockfile unchanged.
- `npm run qa`: **61 passed, 0 failed, 0 skipped**. Includes the existing contact, rate-limit, Turnstile, recipient, release, portability and commercial-contract tests.
- New checks cover empty/published/draft manifests, invalid slugs/URLs/dates, required disclosure fields, duplicate and reserved slugs, real Astro detail generation, escaped hostile text, production canonical/indexing/CSP/redirects and client-template route exclusion. Synthetic build fixtures are temporary and deleted.
- Existing static SEO/link/budget and axe checks now include plugin routes. No production dependencies or additional JavaScript introduced.
- Production-mode Chromium with axe-core 4.11.0: all eight agency pages at widths 320, 390, 768, 1024 and 1440 (**40 checks**); **zero violations**, including rendered color contrast, **zero horizontal overflow**, **zero page exceptions**. Skip-link focus, menu/Escape and reduced-motion checks pass. All eight pages also pass no-JavaScript navigation and 200% root text-size reflow at 320px. See `browser-checks.json`.
- `git diff --check`: passed.

## Impeccable design review and refinement

Method: manual, single-context review using the installed Impeccable skill's new-work, craft-floor, critique and accessibility-audit guidance. **This is a degraded review, not the formal independent dual-agent critique.** The installed skill is accessible, but its executable launcher and detector are absent (`No such file or directory`). Context loading and a detector command were attempted. No detector findings or live overlay are claimed. PRODUCT.md, DESIGN.md, existing hooks and project Impeccable artifacts were absent; the existing code, fonts, tokens and rendered pages supplied design context. No plugin installation/configuration changes were made.

The established design is preserved: Manrope headings, Inter body, navy `#102A43`, blue `#2455DB`, pale `#F4F7FC`, shared header/footer, container widths and button language. The catalog adds an editorial split composition and a restrained connection diagram; services use readable rows rather than a repeated marketing-card grid. There are no fabricated products, marketplace affiliations, pricing, testimonials or statistics.

Review findings resolved in one batch:
- Desktop menu button duplicated visible navigation: hide it above the mobile breakpoint on agency surfaces.
- New navigation item risks crowding tablet and no-JavaScript mobile layouts: agency-only wrapping rules apply across the agency, not only plugin pages.
- Footer focus outline blended into navy: use white for agency-footer focus.
- Plugin detail/catalog text can contain very long strings: enable wrapping within plugin surfaces.

Final confirmation: browser/axe checks and full QA passed after fixes. Typography, empty-state clarity, touch affordances and disclosure hierarchy were visually inspected in desktop/mobile captures. The new content is always visible; motion is limited to existing button feedback and directional link feedback with reduced-motion support. Real screen-reader testing, live Turnstile/mail delivery and Cloudflare runtime verification were not performed. Automated axe results do not establish complete WCAG conformance.

### Screenshots

These are **production-mode** captures at 1440px desktop and 390px mobile, using the existing production configuration in a separate local copy with a synthetic public Turnstile key (`0xsyntheticFixtureKey`). No production credential or tracked configuration was changed. The preview is a local static server; external browser requests and every non-GET/HEAD request are blocked. The Turnstile script request was intentionally blocked; no form was submitted, no email was sent, and no deployment occurred. This does not emulate Cloudflare's HTTP-header enforcement or verify a live challenge.

The initial demo screenshots were reviewed and replaced, not retouched or hidden with screenshot-only CSS. Production already conditions out the demonstration banner, sample-information notice and demo-only footer. Tests now verify that on all eight agency pages plus a synthetic published detail fixture; demo tests confirm the same notices and noindex/contact safeguards remain present in demo mode.

Plugins appears once in the header and footer on every agency page. Above 680px, navigation is visible and Menu is hidden; at mobile widths, Menu opens navigation and Escape closes it and restores button focus. The screenshot capture happens before any keyboard test, so it represents the normal unfocused page.

The additional enlarged-text check exposed existing unbreakable headings on the home, services and privacy pages. An agency-only `overflow-wrap:anywhere` heading rule resolves the text overflow and grid min-content expansion without changing normal-size typography, copy, commercial terms, client-template behavior or security settings. The browser verifier failed on this case before the fix and passes after it.

Re-run browser checks against an isolated synthetic production build (requires Python Playwright and `/usr/bin/chromium`):

```sh
python docs/plugins-review/verify-production.py /path/to/isolated/dist /tmp/ezerwright-review-evidence
```

The verifier starts and stops its own loopback-only static server. Use the original repository's `node_modules/axe-core`; no browser dependency was added to the product.

| Catalog desktop | Catalog mobile |
| --- | --- |
| ![Catalog desktop](plugins-desktop.png) | ![Catalog mobile](plugins-mobile.png) |

| Services desktop | Services mobile |
| --- | --- |
| ![Services desktop](plugins-services-desktop.png) | ![Services mobile](plugins-services-mobile.png) |

## Final logo and navigation polish

The missing white arrow was confirmed in the earlier captures. The header used the Unicode northeast-arrow character inside the Manrope wordmark link. FontTools inspection showed the bundled Manrope cmap does not contain U+2197; Chromium's platform-font trace attributed the rendered character to Manrope while the mark screenshot showed only the navy square. Inter contains an arrow glyph, but it was not the font selected for this span. Font fallback therefore did not give a reliable mark in this environment.

The fix reuses the existing, unchanged `/favicon.svg` as the decorative image inside the same navy square. The arrow geometry, colors, corner radius and EZERWRIGHT wordmark are preserved. It no longer depends on font coverage. The home link retains its accessible name; the image has empty alt text inside the existing aria-hidden span and adds no keyboard tab stop.

Menu now uses an aria-hidden, nonfocusable 16px vector plus icon, replacing the fullwidth-plus text glyph. Agency-only flex alignment and an explicit 8px gap separate the label from the icon without changing the breakpoint or JavaScript behavior. The unchanged shared UI script still controls expanded state, Escape dismissal and focus restoration; no-JavaScript navigation remains visible.

Final checks: all 40 agency page/width cases pass logo asset loading, visible keyboard focus on the home link, Menu spacing/touch height, navigation, axe, reduced motion and reflow checks. Additional checks pass at exactly 680px (Menu) and 681px (desktop navigation), including following the Plugins link, and the logo loads at desktop/mobile sizes with both webfonts blocked. The regression test for a font-independent existing logo asset failed before the fix and passes after it. All four production screenshots were replaced and visually inspected; the arrow is visible and the mobile control has clear separation.

The full suite passes 61 tests, with no failures or skips. The default demo build still retains its protections. No website-package copy, offer/configuration, plugin manifest/routing, form code, Worker code, font files, favicon artwork, credentials, security headers, privacy content or approval gates changed in this polish pass. No new dependency or JavaScript was introduced.

Local verification supports owner code review, **not an unconditional merge recommendation**. Cloudflare's integration is active and previous main/PR hosted checks failed. Its current production trigger settings and failure logs remain unverified. The review-only commit uses the documented Pages skip prefix; it must not be taken to suppress a future merge deployment.

## Review and deployment checklist (not executed)

- [ ] Review branch, screenshots, empty catalog and separately scoped service copy.
- [ ] Confirm publication remains a separate owner decision; no plugins are currently published.
- [ ] Review production build variables and existing approved privacy/Turnstile setup; use real secrets only through the existing protected release process.
- [ ] Obtain explicit authorization before merging or deploying. This change grants neither.
- [ ] After an authorized release, verify canonical/robots/sitemap/headers/navigation/contact paths using the existing release procedure.

## Rollback

Revert the feature commit and rebuild through the existing reviewed release process. No database, secret, Worker binding, recipient, API whitelist, DNS or marketplace state changed. Restoring an earlier static artifact should follow the existing owner-controlled release gates. No rollback deployment was executed.
