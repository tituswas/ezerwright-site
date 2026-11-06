# EZERWRIGHT two-service website refresh

Goal: refresh the existing Astro agency site and introduce the planned AI-app security-review business without implying it is already operational.

Owner request: update the existing website's look and mention the audit business; perform the work through the existing site and GitHub access. Website-agency operations and the 20-email batch setting are outside this change.

Design: retain the existing routes and interactive project brief; use a more editorial midnight/ivory visual system with a warm audit accent. Put website development and forthcoming source-code security reviews on distinct paths. Add /audits/ with coming-soon status, written authorization/source access requirements, evidence-based proposed deliverables, no price and no guaranteed-security or Cloudflare-affiliation claims. Reuse /contact/?service=other rather than creating a new inbox or data collector. Keep current published website commercial terms unchanged.

Architecture: reuse Layout/Header/Footer and existing protected contact route. Add an agency-only stylesheet and audit route. Preserve plugin/client templates, noindex showcase rules, privacy, CSP, Turnstile, backend, DNS, and deployment configuration. Pin baseline 423cc26db03a4431738c2a946db50c07bdf1c104 for rollback.

Implementation and evidence:
- [ ] Add failing route/navigation/metadata/motion tests; run existing CI on an isolated PR.
- [ ] Refresh the home component; add audit page, navigation, metadata and sitemap entry.
- [ ] Run full locked-dependency build/tests, inspect actual rendered desktop/mobile layouts and links.
- [ ] Review diff for unrelated changes and commercial overclaims.
- [ ] Merge only after tests pass; verify Cloudflare deployment and distinguish deployment status from independently fetched live content.

Review focus: mobile navigation width; no-JavaScript reachability; reduced motion; no client-template leakage; prelaunch wording and safe contact routing. Browser review must use the real compiled output, not a fabricated preview. Do not report contact email delivery unless an actual authorized delivery test is performed.
