# Plugin catalog maintenance

The agency catalog uses `src/config/plugins.json`, initially `[]`. Keep entries empty until genuine releases and their claims are approved. Do not add entries to `site.pages`; the agency marketing-page contract remains six routes including privacy.

Every entry must provide:

- `status`: `draft` or `published`; only explicitly published entries generate detail routes and sitemap entries.
- `slug`: lowercase letters/digits separated by single hyphens, starting with a letter, maximum 80 characters; unique and not `services`.
- `name`, `summary`: accurate plain-text product information.
- `platforms`, `prerequisites`, `permissions`: nonempty arrays of plain-text disclosures. State absence of requirements or permissions explicitly when verified.
- `dataPractices`: accurate plain-text security/data-handling explanation.
- `installation`: nonempty array of plain-text installation steps.
- `links`: actual `docs`, `source`, `install` HTTPS URLs without credentials or whitespace. Review destination ownership and safety before publishing.
- `license`, `version`, `releaseDate`: actual release details; date in valid `YYYY-MM-DD` form.

All entries, including drafts, must pass validation. Invalid input fails the build. Publishing status is a deliberate source change requiring review; validation cannot independently verify product claims or destination contents. Templates escape strings as text; never change these fields to untrusted HTML.

Routes are `/plugins/`, `/plugins/services/`, and `/plugins/[slug]/`. Optional catch-all Astro source routes allow the agency-only catalog and services routes to generate zero pages for client templates. Published details likewise disappear for clients. There are no category filters before real categories exist. Empty manifests generate zero details.

Support is separate from the $500 website package. Contact links reuse `/contact/`; the existing “Not sure yet” option maps to `other`. No backend whitelist or form changes are needed.

Run `npm ci --ignore-scripts` and `npm run qa` with Node >=22.19.0. Production fixtures use synthetic values and never publish. See `plugins-review/REVIEW.md` for browser evidence and release restrictions.
