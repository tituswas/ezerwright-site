# Verification evidence — 13 October 2026

| Check | Observed result |
| --- | --- |
| Final locked installation | `npm ci --offline --ignore-scripts --no-audit --no-fund` completed successfully; task-local dependencies, preserved starter untouched |
| `npm run qa` | Astro build exit 0; 55 tests passed, 0 failed, 0 skipped |
| Production fixture | Six marketing/privacy routes plus 404 built using temporary synthetic-key configuration; no demo banners/placeholders/duplicate brand titles on public routes |
| Release gates | Missing production key/privacy approval blocks the build; Cloudflare Pages refuses demo-mode publication |
| CSP | Build-generated script hashes match the six production pages; security headers and redirects asserted |
| Contact Worker settings | Derived from production source; preparation succeeds independently of demo build files; recipient binding restricted |
| Form truthfulness | Lost response preserves form values and reports unconfirmed submission; success still requires adapter acceptance |
| Contact trust boundaries | Origin/method/media/body/field/honeypot/challenge/rate/provider error cases checked; no real email sent |
| MIME | 2,000 Unicode characters round-trip through bounded Base64 lines; Date and Message-ID headers checked |
| Accessibility | axe structural, semantic, deterministic text contrast, focus/menu/error/success DOM and reduced-motion CSS checks pass |
| Packaging | Portable source/build hashes and manifest/source version tested; dependencies, runtime data and secrets excluded |
| Contact dry bundle | Wrangler 4.150.0 exit 0; 15.70 KiB / gzip 5.72 KiB; fixed placeholder email destination and stable 5-request/60-second rate binding; nothing deployed |
| Production dependency audit | 0 known vulnerabilities |
| Full dependency audit | 0 known vulnerabilities, including deployment tools |
| Diff whitespace check | Exit 0 |
| Independent review | No important code defects identified; documentation caveats corrected |
| Local Cloudflare runtime smoke test | Startup blocked by environment error `uv_interface_addresses ... system error 1`; real Worker runtime behavior remains unverified |
| Latest public MX lookup | Timed out; no new DNS/routing claim made |

Versions checked: Node 24.19.0; Astro 7.3.8; JSDOM 29.0.0; axe-core 4.11.0; Wrangler 4.150.0; esbuild 0.28.1. The production-only esbuild Windows-development advisory was resolved by the patch override. Full audit findings affecting the earlier deployment CLI were resolved by the Wrangler update. Audit output is evidence for the currently locked dependency graph, not a guarantee against future vulnerabilities.

GitHub main remains baseline `6a56cf482c6654886b57e839c344623c81cb63e7`: branch creation is denied by the integration, and direct main update was rejected by automatic approval review. Cloudflare dashboard automation is stopped as instructed. Live layout, actual Turnstile, deployed header/redirect enforcement, forwarding, form-email arrival and Reply-To remain release checks. No deployment, real email, paid call, credential change or prospect outreach occurred.
