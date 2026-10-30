# EZERWRIGHT website

Astro marketing site: Home, Services, Approach, Living Websites, Contact and Privacy. The approved offer remains US$500, split $250/$250, with two consolidated revision rounds.

## Check the source

Use Node.js 24 (or a compatible release satisfying `package.json`).

```sh
npm ci --ignore-scripts
npm run qa
WRANGLER_SEND_METRICS=false npx wrangler deploy --config wrangler.contact.jsonc --dry-run --outdir .wrangler/contact-dry-run
```

The tests include a temporary production fixture using a synthetic Turnstile key. They never send real mail or deploy. `npm run demo` serves the built site on loopback and captures synthetic enquiries locally; `npm run dev` is the Astro layout editor without a contact API. These local tools must not be exposed publicly.

## Cloudflare cinematic preview builds

The Cloudflare Pages **non-main branch** preview is intentionally separate from the production release. Cloudflare supplies `CF_PAGES=1`, `CF_PAGES_BRANCH` and `CF_PAGES_URL`. A verified preview URL under `*.ezerwright-site.pages.dev` loads the agency's production *public copy* but forces **demo/noindex mode**, disables all contact form submission, and provides a prominent review-only notice and a link to the live contact page. Neither a Turnstile credential nor an email provider is used for these preview builds. The preview never enables unattended outreach or updates the production website.

A Pages deployment of `main` **still requires** the approved production configuration, actual Turnstile site key and existing privacy gate. Missing/foreign preview URLs and missing branch identity fail closed. Run `npm run qa` before merging; the regression suite builds an isolated simulated Pages preview to verify no contact form and enforce the production gate.

**Privacy:** Cloudflare Pages preview URLs may be public by default. Enable Cloudflare Access for preview deployments in the project settings before using internal or non-public material. No passwords, prospect data or client-only assets belong in these showcases.

## Production configuration

`src/config/production.json` has the actual origin `https://ezerwright.com`, contact `hello@ezerwright.com`, public copy, and a privacy notice awaiting owner review. Set Pages build variables `SITE_CONFIG=src/config/production.json`, a real `TURNSTILE_SITE_KEY`, and `PRIVACY_APPROVED=true` only after that review. Keep `npm run build` and output `dist`. Without these values the production build stops. Cloudflare Pages also refuses a demo-mode build, so missing release settings cannot silently republish the demonstration. The local default remains available for synthetic QA.

The production build emits canonical URLs, indexable robots/sitemap, CSP with hashes for inline structured data, HSTS, anti-framing and privacy headers. Host redirects are not generated in `_redirects`: Cloudflare Pages accepts source paths only. Account-level rules for www and the Pages hostname require separate owner approval; see [redirect setup and release checklist](docs/CLOUDFLARE_REDIRECTS.md).

## Contact delivery

Pages serves static files. It does **not** deploy `worker/index.mjs` just by running the Astro build. Deploy the separate `worker/contact.mjs` with the restricted contact configuration and route `ezerwright.com/api/*` to it. This keeps form submissions same-origin and supports Cloudflare's email and rate-limit bindings.

Set server-only `CONTACT_TO` to the verified owner-approved Gmail destination, `TURNSTILE_SECRET`, and a random `RATE_LIMIT_SALT`. Never put these into static assets, GitHub, or an uploaded handoff. `CONTACT_FROM` is `hello@ezerwright.com`. The backend verifies the challenge hostname and `contact` action, rate limits salted IP hashes, validates and bounds fields, and uses the visitor address only as Reply-To. It never takes a recipient from the form.

Run `npm run contact:prepare` from this project directory. It reads `CONTACT_TO` from the process environment and writes `.wrangler/contact-deploy.json`. The contact Worker reads its runtime settings directly from the production configuration, independently of the Pages build; later demo builds cannot change its mode. This ignored local file restricts the email binding to that recipient without publishing the private destination in source. Run `npm run contact:check` for a local dry bundle and `npm run contact:deploy` for account-authorized deployment using this generated file, **not** the tracked `.invalid` template. Set runtime secrets in Cloudflare securely. Actual deployment and binding creation require account access and applicable approvals.

Email Routing is separate: `hello@ezerwright.com` must forward to the verified destination, with Cloudflare's required mail DNS records. Before switching MX providers, preserve the current records and identify other forwarding addresses. Provider acceptance alone does not prove arrival in Gmail.

## Adapt and hand off

`node scripts/adapt.mjs examples/exterior-demo.json ../client-site` creates an isolated fictional client example, refusing to overwrite an existing directory. Edit that client's approved configuration and privacy details. Run its checks before release. The protected prospect/research files are outside this repository and are not used or modified here.

`npm run package` creates a portable source/static handoff with a SHA256 manifest, excluding secrets, dependencies and captures. Static files require the separate contact backend for real submissions. The local defaults are intentionally not a production release. Font license notices are in `docs/licenses`.

See `docs/PRODUCTION_STATUS.md` for verified results, remaining account gates, release order and rollback. `docs/CLOUDFLARE_OWNER_ACTIONS.md` contains only the dashboard actions the owner must perform. No paid service or prospect outreach is part of this work.
