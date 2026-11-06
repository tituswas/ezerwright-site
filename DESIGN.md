---
name: EZERWRIGHT Living Studio
description: An editorial digital studio grounded in natural photography and considered typography.
colors:
  forest: "#284b39"
  charcoal: "#242923"
  warm-ivory: "#f5f1e8"
  paper: "#eee9dd"
  antique-brass: "#8a7044"
  muted-olive: "#626b5c"
  border: "#c7c2b2"
  field-border: "#718068"
  focus: "#3c664a"
  photo-text: "#ffffff"
typography:
  display:
    fontFamily: "Manrope, Inter, sans-serif"
    fontSize: "clamp(50px, 5.3vw, 83px)"
    fontWeight: 800
    lineHeight: 1.01
    letterSpacing: "-0.075em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  editorial:
    fontFamily: "Georgia, serif"
    fontWeight: 400
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  square: "0"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.warm-ivory}"
    rounded: "{rounded.square}"
    padding: "17px 24px"
  field:
    backgroundColor: "#faf8f1"
    textColor: "#273d2d"
    rounded: "{rounded.square}"
    padding: "11px"
---

# Design System: EZERWRIGHT Living Studio

## Overview

**Creative North Star: "Living Studio"**

The user-approved world combines warm paper, charcoal type, deep forest green, restrained antique brass and natural photography. The agency feels like a working editorial studio: bold and composed, with tangible sheets, photographic studies and real website content.

The previous glass, titanium and abstract-ring direction was rejected. The approved reference establishes the layered composition; it must remain native HTML and CSS rather than a screenshot of a complete page. Individual generated photographs illustrate fictional business concepts and are never presented as client project evidence.

**Key Characteristics:**

- Strong sans-serif headlines with occasional italic serif emphasis.
- Warm ivory space, forest actions and restrained brass details.
- Natural garden, pool and residential exterior photography.
- Layered editorial studies with useful, accessible interaction.

## Colors

Forest carries primary actions, service emphasis and the footer. Charcoal supplies the main reading contrast on warm ivory; paper tones distinguish supporting surfaces. Antique brass is reserved for small separators and specimen details. Muted olive supports secondary copy and fine rules.

**The Photo Foreground Rule.** Headings over photographic concepts use the white photo-text token explicitly, with a dark image overlay. Agency-wide charcoal heading defaults must not override them.

## Typography

Manrope provides the wordmark, display headlines and interface titles. Inter carries body copy, navigation and labels. Georgia provides the type specimen and selected italic emphasis. Local font files are used; no additional font service is required.

The large desktop display treatment and tight tracking are specific to the approved hero. Supporting copy stays more relaxed and legible; mobile sizes are explicitly reduced in the implementation. The miniature website studies use a compact internal hierarchy, while their links and surrounding carousel controls remain keyboard accessible.

## Layout

The shared agency container reaches 1,320px with 48px side margins on large screens, 32px at narrower widths and 20px on small screens. The desktop hero places strong copy on the left and a layered studio composition on the right. At 760px and below the composition moves beneath the copy and keeps space for the complete website panel and controls.

Services, contact and other agency routes inherit the same palette and typography while keeping their practical content structure. Client-template adaptations retain their independent theme and layout.

## Elevation & Depth

Photographic sheets, the type specimen and website panel overlap with small rotations and offset soft shadows. Depth expresses physical paper and a working studio, rather than glass or abstract chrome. Interior content and forms rely primarily on surface tones and borders.

The website turn is an explicit interaction, with a short perspective rotation and fade. Reduced motion and the pause control remove that animation while preserving design selection.

## Shapes

Agency buttons, form fields, content containers and the foreground website use square corners. Fine rules and rectangular photographic crops carry the editorial language. The layered hero is deliberately composed; it is not a repeated rounded-card pattern.

## Components

### Buttons and navigation

Primary actions use forest with light text. Secondary actions use an underlined text link. Focus receives a visible forest outline with space around the control. The header uses a charcoal wordmark, a clear current-page marker and an expandable mobile navigation. The footer reverses the palette onto forest.

### Inputs and enquiry handoff

Contact fields use pale paper, dark forest text and a visible forest-gray boundary. Native labels, error/status semantics, validation and the protected enquiry route remain functional. Project Room keeps a focused dialog flow with an editable handoff into the existing contact form. Interactive brief choices do not collect personal information or send requests.

### Website showcase

The first foreground design is Stone & Stream, opening with “Thoughtful landscapes for everyday living.” The panel is a real miniature website with a masthead, photograph, heading, concept link and service strip.

Wheel handling applies only inside that panel. One continuous gesture advances one design until a quiet interval of more than 180ms; a direction reversal starts a new gesture immediately. Page scrolling releases at the first and final designs. Previous/next buttons, focused arrow/Home/End keys and horizontal swipes provide alternatives. Vertical touch scrolling remains native. If the outgoing panel contains keyboard focus, focus returns to the showcase before that panel becomes hidden and inert.

## Do's and Don'ts

- Do preserve warm ivory, charcoal, forest and restrained brass as the approved agency palette.
- Do keep photographic text explicitly white and verify the actual CSS cascade.
- Do build website studies as real content with working routes and native controls.
- Do label fictional concepts clearly and preserve preview form disabling and noindex.
- Don't restore the rejected glass-art or abstract-ring identity.
- Don't ship the approved concept screenshot as the whole website.
- Don't let wheel gestures trap page scrolling or hide focused content.
- Don't apply agency-specific appearance rules to independent client templates.
