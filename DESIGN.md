---
name: EZERWRIGHT — The Director
description: Cinematic architecture, split-line display type and fictional website
  studies.
colors:
  background: '#111'
  charcoal: '#1a1a1a'
  surface: '#1c1c1c'
  heading: '#f5f5f5'
  text: '#eee'
  muted: '#bcbcbc'
  copy: '#c4c4c4'
  secondary-heading: '#aaa'
  red: '#c82c19'
  red-hover: '#ac2516'
  hero-red-hover: '#b62413'
  accent: '#f07867'
  brand-mark: '#e73521'
  border: '#484848'
  price-border: '#454545'
  field-border: '#777'
  focus: '#ff866c'
  white: '#fff'
typography:
  hero:
    fontFamily: Manrope, Arial, sans-serif
    fontSize: clamp(76px, 10.4vw, 155px)
    fontWeight: 500
    lineHeight: 0.91
    letterSpacing: -0.04em
  hero-serif:
    fontFamily: Georgia, serif
    fontSize: inherit
    fontWeight: 400
    lineHeight: 0.91
    letterSpacing: -0.04em
  interior-title:
    fontFamily: Manrope, Arial, sans-serif
    fontSize: clamp(36px, 4.4vw, 60px)
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.03em
  section:
    fontFamily: Manrope, Arial, sans-serif
    fontSize: clamp(30px, 3.3vw, 44px)
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.03em
  approach:
    fontFamily: Manrope, Arial, sans-serif
    fontSize: clamp(32px, 3.5vw, 48px)
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: -0.03em
  scope:
    fontFamily: Manrope, Arial, sans-serif
    fontSize: clamp(32px, 3.4vw, 46px)
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.03em
  process:
    fontFamily: Manrope, Arial, sans-serif
    fontSize: 26px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.025em
  body:
    fontFamily: Manrope, Arial, sans-serif
    fontSize: 16px
    lineHeight: 1.75
  price:
    fontFamily: Manrope, Arial, sans-serif
    fontSize: 60px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.04em
  gallery:
    fontFamily: Georgia, serif
    fontSize: clamp(42px, 5.4vw, 78px)
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: -0.03em
rounded:
  square: '0'
  circle: 50%
spacing:
  home-gutter: 4.8%
  mobile-gutter: 6%
  home-section: 110px
  interior-section: 90px
  home-mobile-section: 75px
  interior-mobile-section: 70px
components:
  button-primary:
    backgroundColor: '{colors.red}'
    textColor: '{colors.white}'
    rounded: '{rounded.square}'
    padding: 17px 22px
  price-panel:
    backgroundColor: '{colors.surface}'
    padding: 36px 38px
  field:
    backgroundColor: '{colors.background}'
    textColor: '{colors.white}'
    rounded: '{rounded.square}'
  hero-action:
    backgroundColor: '{colors.red}'
    textColor: '{colors.white}'
    width: 170px
    height: 170px
    rounded: '{rounded.circle}'
---

# Design System: EZERWRIGHT — The Director

## Overview

**Creative North Star: The Director.** The approved agency identity pairs cinematic black-and-white architecture with a split-line Manrope/Georgia hero, neutral charcoal surfaces and restrained red actions. All agency interior headings use upright Manrope. Native HTML, real links and full-width fictional website studies make the composition functional.

## Colors

Background, charcoal and surface form the three dark layers; white and gray carry the content. Red marks primary actions and the closing contact band. Coral supports navigation states and small labels; peach marks visible focus. No cream or green brand surfaces are used. Existing contact success/error colors remain functional status treatments, independent of the brand palette. Full-colour fictional study photography remains intentional.

## Typography

Manrope with Arial/sans-serif fallbacks serves agency body, navigation and every interior heading. Hero line one is medium-weight Manrope and line two is normal-weight italic Georgia; neither is horizontally compressed. Georgia also serves fictional study mastheads and gallery titles. Interior emphasis inherits the surrounding sans font and changes to gray. The hero becomes `clamp(70px,14vw,110px)` at 800px and `22vw` at 500px. Homepage process copy is 15px; titles are 26px, 24px at 800px and 23px at 500px.

## Layout

Agency interior containers are `min(1320px,90.4%)`, becoming 88% at 800px. Homepage sections use 4.8% gutters and 110px vertical padding, changing to 6% / 75px at 800px. Interiors use 90px section padding, reducing to 70px. Above 1600px, homepage gutters use `max(4.8%,calc((100vw - 1440px)/2))`. Approach and service offer use asymmetric two-column layouts that stack at 800px. Interior architecture is a square-edged, unrotated grayscale crop, 300px high and 230px at 800px. Main navigation collapses at 920px into a toggle-controlled two-column link grid.

## Elevation & Depth

Architecture, dark overlays, photographic perspective and subtle tonal changes provide depth. Agency panels and primary actions explicitly remove decorative shadows and rotation. Gallery imagery retains colour and a dark gradient to protect white text.

## Shapes

Agency cards, fields, panels and primary rectangular actions use square corners. The hero action and gallery controls are circular. Thin gray or translucent-white rules separate content. The wordmark ends in a small red square.

## Components

### Actions and navigation

Primary agency actions use red, white text, 17px 22px padding and a darker red hover. The homepage scope action uses 17px 20px, reducing to 16px at 500px. The hero circle measures 170px, then 115px at 800px and 92px at 500px; hover darkens and rotates it -6 degrees. Focus uses a 2px peach outline with 5px offset. Header links use 13px Manrope and a 26px gap, reducing to 12px / 18px at 1000px. Services, Plugins and Audits remain working agency routes.

### Full-width study gallery

The existing tested native horizontal controller is retained. The flex deck has zero gap, horizontal overflow, mandatory horizontal scroll snapping and 100%-width panels. Image stages are 600px, 530px at 800px and 490px at 500px. All three fictional concepts and links remain in the document; selection never hides or makes focused content inert. Previous/next buttons, focused arrow/Home/End keys, horizontal swipes and bounded wheel gestures remain available. One continuous wheel gesture advances once; a quiet interval greater than 180ms or reversal resets it. Page scrolling releases at gallery boundaries. Every panel retains explicit fictional-concept disclosure and an existing interactive route. No-JavaScript visits still expose all studies.

### Pricing

The homepage panel uses a charcoal surface with 36px 38px padding; responsive padding is 28px at 1000px, 30px at 800px and 24px 20px at 500px. Its price is 60px, 52px at 1000px, 56px at 800px and 50px at 500px. Currency sits on the numeral baseline at 20px, then 17px. Homepage features are 15px / 14px mobile; two payment columns use 18px amounts and 13px / 12px captions. The service page likewise uses a compact 60px price, reducing to 50px at 680px, with 20px / 17px baseline currency. Service-page payment amounts are 22px. Show the current introductory US$299 five-page offer only with written eligibility and scope confirmation, US$179 after approved scope and US$120 after staging sign-off/before launch. Do not inherit historical contract limits. Domain, hosting and optional maintenance are separate. Existing signed agreements retain their terms. Updates and integrations remain separately scoped.

### Contact and Project Room

Contact fields use dark backgrounds, white text, gray borders and square corners. Keep existing labels, validation, error/success states, production Worker delivery, security and preview restrictions. Project Room remains a native dialog with dark surfaces, red actions and readable selected states; its existing privacy behavior remains intact. Security audits are coming soon and are not bookable.

### Motion

Reduced-motion preference and the explicit pause control remove animation and transitions. Preserve native scrolling and keyboard operation. The hero action uses a .5s `cubic-bezier(.16,1,.3,1)` transform and .25s background transition.

## Do's and Don'ts

- **Do** apply the approved agency identity across home, interiors, plugins, audits, contact and Project Room.
- **Do** preserve agency/client-template isolation; agency rules are scoped under `.agency-experience.approved-director` and agency-only layout loading.
- **Do** retain actual enquiry functionality, preview restrictions, truthful pricing and fictional-study labels.
- **Do** keep full-width gallery links accessible and preserve its tested controller.
- **Don't** restore cream/green brand surfaces, condensed display treatment or italic interior headings.
- **Don't** invent client proof, conversion outcomes or audit availability.

## Production QA inheritance — 10 November 2026

Read the live Website Design Standards, Website Prompt Playbook and current SOP before revisions: https://docs.google.com/spreadsheets/d/1rNpX6f5Qp-ocfKqwrJhg9fgpGUYJO_uLg6M-WjNLLH0/edit . Apply AUDIT → FIX → RECHECK → DEPLOY → VERIFY LIVE. DES-02 bans cream, ivory, beige, warm off-white and yellow-tinted UI surfaces (photographic colours exempt). DES-12 prohibits new 3D experiments. Preserve the Director identity and independent niche demos. Scope white agency heading rules carefully: fictional showcase light sections require their own dark headings and dark button text. Closing red sections require white paragraph copy. Required fields must reject Unicode whitespace before network submission and clear field errors on edit.
