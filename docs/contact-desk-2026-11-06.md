# Contact desk

## Observed problem and direction
Production baseline 0feaed350cda578e9f8ca9a47b3f9e12f6f59388: the Contact route used the older serif/gold illustration and a tall introductory hero, pushing the enquiry form below the fold. The homepage now uses original glass artwork, cool colors and Manrope typography.

The contact desk extends that existing identity to the decisive conversion step. First viewport: editorial introduction and original glass artwork on the left; an ice-colored, readable enquiry surface on the right. The actual form is immediately available. On mobile the introduction is compact, decorative art is omitted, and fields stack at 16px. A short sequence below explains the next steps and existing price/scope without adding promises.

Considered alternatives: another homepage visual change would leave the handoff inconsistency; another wizard would duplicate Project Room. This implementation improves the actual destination with no new JavaScript, data collection or dependency. This is an implementation choice under the owner's instruction to innovate and ship, not a separately approved mockup.

## Preservation and rollback
The contact handler, validation, rate protection, Turnstile, notification configuration, field names and submission script are unchanged. Client-template output remains on its existing path. Preview builds still have no form. Existing Project Room preferences still prefill the editable contact message.

Rollback: redeploy main commit 0feaed350cda578e9f8ca9a47b3f9e12f6f59388 through the existing Cloudflare Pages project, or revert this release commit and allow its existing Git deployment. No database/configuration migration is needed.

## Verification
Build, full regression suite, route/asset budgets and accessibility checks will run before release. Browser QA covers actual contact layout and prefilling; no synthetic enquiry will be sent externally. No conversion uplift is claimed without analytics.
