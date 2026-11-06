# Living Studio Implementation Plan

> For agentic workers: use subagent-driven development for the bounded implementation; parent owns release.

Goal: Replace the rejected glass/teal agency design with the approved Living Studio direction and interactive website showcase.
Architecture: Retain Astro routes, form handler and deployment; build HTML/CSS website panels with photographic assets, plus bounded wheel/swipe/keyboard transitions. No screenshot baked into the whole page. Preserve current site facts and backend.
Tech Stack: Existing Astro, vanilla JS and CSS, no new dependencies.
Spec: User approved warm ivory, charcoal, forest green, antique brass; editorial concept composition and scroll-over-panel animated design changes, reversing and releasing at boundaries. Responsive touch, keyboard and reduced motion required.

Global constraints: Existing repo and domain only; preserve contact route, spam protection, SEO, pricing US$500 and Project Room handoff. Concepts clearly fictional. No external mail tests. Restore reference 9c17461b20e5d1df48f79b5cadb43743fbeef770.

Review focus: Wheel gestures must not trap page; horizontal touch must not block vertical scrolling; reduced motion must remain functional; keyboard must reach every design and link; clients and preview capture protections must remain unchanged.

Tasks:
- [ ] Implement living-studio homepage and native layered website showcase; use existing actual showcase routes and real photographic assets. Apply agreed palette consistently to agency shell and existing public interiors, retaining practical forms and content.
- [ ] Verify meaningful interaction tests for wheel boundaries/reversal, keyboard, touch, reduced motion and contact preservation; run build and full regression suite without weakening safety/budget checks.
- [ ] Review browser output and source, fix material issues, save source branch, publish through existing GitHub/Cloudflare workflow and verify live result. Record exact commit and rollback.
