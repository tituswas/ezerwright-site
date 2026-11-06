# Task 1 — Integrated Director presentation

Implemented the approved composition as native Astro HTML and CSS: original full-bleed architecture, compressed Manrope white “Make an entrance.” headline, vermilion Start your project action and a three-study fictional website filmstrip immediately below. Removed paper-collage composition and duplicate study grid. Existing content explains the agency, offer and enquiry path.

Replaced Living Studio shared stylesheet with agency-only `public/director.css`. Carried charcoal/white/vermilion through interiors, navigation, contact, Project Room, brief controls, plugins and audits. Architecture crops replace rotated garden sheets on agency interiors/contact. Preserved independent client templates, exact enquiry options, backend/security/configuration, offer and SEO restrictions. No dependencies or fonts added. Original asset provenance is recorded separately.

Intentionally adapted the showcase from hidden/inert panels to a native horizontal filmstrip: all three real study links remain rendered and accessible, selection never hides focused content, and desktop shows all three cards. Native horizontal scrolling synchronises selection. On an overflowing rail, bounded vertical wheel gestures select one study per gesture; boundaries release page scroll. When all cards fit, wheel scrolling stays native. Touch overflow uses native scrolling, avoiding duplicate custom swipe movement. Buttons, focused arrows/Home/End, reduced motion and pause remain supported. Tests cover the new geometry-dependent behavior and preserved gesture/focus contracts.

Validation: `npm run build` passed; `npm test` passed all 97 tests (including axe structural accessibility, preview form/noindex restrictions, production fixtures, client adaptation, contact and worker tests). No budget changes. Representative linked CSS bytes / gzip bytes: home 48,349 / 10,510; services 50,684 / 11,603; contact 39,838 / 8,855; plugins 42,198 / 9,432; audits 30,460 / 6,957. Existing limits remain 56 KiB route raw CSS, 12 KiB route gzip CSS, 96 KiB total CSS and 20 KiB JavaScript. `git diff --check` passed.

Updated PRODUCT.md, DESIGN.md and .impeccable/design.json to the approved Director identity. Existing tests changed only for obsolete aesthetic contracts or the intentional accessible filmstrip behavior.

Hosted visual review and publication are handled by the parent agent after this implementation commit. Structural axe checks do not measure rendered contrast or clipping; hosted browser review remains necessary before publication. Rollback baseline: 380af4b.
