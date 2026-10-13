> Forward-only private EZERWRIGHT v0.1.2 derivative; source baseline v0.1.0 is frozen. Owner reported no USPTO/IP India results; public release still requires all deployment and email gates.

# EZERWRIGHT — private agency launch candidate v0.1.2

A branded, private derivative of the frozen neutral v0.1.0 website starter. This agency demonstration has **five marketing pages plus Privacy**: Home, Services, Approach, Living Websites, Contact and Privacy. The reusable original client template still supports four marketing pages plus Privacy and can add a scoped fifth page. No public deployment, paid service, account creation or prospect outreach.

## Run it

Use Node.js 24 or another compatible current LTS release with Internet access to install the locked dependencies. This forward copy has not undergone a successful fresh Astro build in the current environment.

```sh
npm ci --ignore-scripts
npm run qa
npm run demo
```

Open **http://127.0.0.1:4321/** on the computer running the server. Use sample details only. The contact form writes to `.runtime/inbox.jsonl`; it sends **no email**. The server binds to loopback only. Stop with Ctrl+C and delete the capture file after testing. Do not expose this development server to the internet. `npm run dev` is Astro's layout editor; it does not provide the contact API. Use `npm run demo` after a build for the full flow.

## Adapt without changing components

Edit `src/config/site.json`: display name, origin, palette, hero, service categories, page metadata/content, contact placeholders and mode. Demo is `noindex, nofollow`; robots disallows indexing. Colors are validated for intended 4.5:1 text combinations. Typography uses local subset OFL fonts. The illustration is an original SVG; no remote images, analytics or runtime font requests.

An actual configured second example is supplied in `examples/exterior-demo.json`. It contains fictional sample content only and no facts about the existing prospects.

```sh
node scripts/adapt.mjs examples/exterior-demo.json ../new-client-demo
cd ../new-client-demo
npm ci --ignore-scripts
npm run qa
npm run demo
```

The adaptation command refuses existing destinations, copies the reusable source without dependencies, captures or build/runtime files, and replaces only client configuration. `template: "client"` uses configured section/card content; it does not advertise the agency's $500 offer as the client's service price. `src/config/offer.mjs` remains unchanged. See `docs/CLIENT_WORKFLOW.md`.

## Test and hand off

`npm run qa` builds and runs the full Node test suite: config and offer limits, HTTP/contact trust boundaries, native responses, local capture, DOM menu/form states, axe structural checks, local links/assets, content/SEO, size budgets, adaptation and package hashes. Color ratios are deterministic calculations. DOM checks use JSDOM, not a live browser. Browser layout/reflow/focus/color-contrast audits, actual screen-reader testing and field performance remain separate release checks.

```sh
npm run package
```

Produces `handoff/v0.1.2/source`, `site` and a SHA256 manifest after a fresh build/test. It refuses an existing output. Choose a new directory with `node scripts/package.mjs handoff/review-2`. The static `site/` works on ordinary static hosting, but its contact API needs the supplied adapter. Source, lockfile, notices and configuration travel with it. See `docs/HANDOFF.md` for clean rebuild, release and rollback steps.

## Cloudflare-compatible, never deployed here

```sh
WRANGLER_SEND_METRICS=false npm run cloudflare:check
```

This runs **only a dry bundle**. No account/login/payment/domain is needed and nothing is uploaded as a deployed site. The Worker routes `/api/contact` through the shared handler; assets use the assets binding. Demo mode refuses live sends. To prepare actual production later, the owner must approve the real identity, origin, contact/privacy facts, Turnstile key and `productionApproved/ privacyApproved` flags; set real server-only sender/recipient/secrets; replace the restricted destination placeholder in `wrangler.jsonc` with the approved inbox; verify account availability and routing DNS. Never use the `.invalid` addresses as real contacts. Never invoke `wrangler deploy` without owner/client publication approval.

The production adapter verifies challenge hostname/action, fixed recipient, bounded fields, honeypot, same-origin POST and rate binding. Provider acceptance is not proof of final inbox delivery. Tests use a controlled provider contract; no real Cloudflare challenge or mailbox was contacted. Rate limiting uses an experimental Wrangler binding and is eventually consistent; validate it in the actual account. See `docs/BLOCKERS.md`.

## Project map

- `src/config`: verified JSON configuration loader, palette/schema guard and immutable offer.
- `src/components`: header/footer, cards, CTA, contact form and generic client sections.
- `src/layouts`, `src/pages`, `src/styles`: semantic multi-route layout, utility404 and responsive styles.
- `lib/contact.mjs`: shared HTTP validation and honest success/failure response.
- `public/ui.js`: optional menu/form enhancement; navigation/content and native form work without it.
- `worker`: Cloudflare-specific challenge/mail/rate adapter and asset entry point.
- `scripts`: build, loopback demo, client adaptation and handoff packaging.
- `test`: runnable checks; `EVIDENCE` in the outer package: scoped test records. A complete build-dependent audit is still required before launch.

This is the website delivery foundation, not an autonomous agency/CRM. AI, automation, analytics, ongoing optimization and maintenance are later scoped work. The $500/$250+$250 offer, revision bounds and existing protected research remain preserved.
