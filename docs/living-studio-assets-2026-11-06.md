# Living Studio original assets

Three original AI-generated photographic assets for fictional design studies. These are not photographs of client projects and must not be represented as such. Generated 2026-11-06 using the available image-generation service, then resized to 1200x800 and encoded WebP quality82 with ffmpeg. No third-party reference imagery was copied.

## living-garden.webp
Prompt: A premium editorial architectural photograph of a richly planted English-style contemporary garden, mature olive tree, soft cream limestone steps winding through lavender and ornamental grasses, warm late-afternoon sunlight and deep forest-green foliage, natural realistic colors, high-end landscape architecture magazine photography, no people, no text, no logo, no collage, single landscape photograph 3:2. Restrained cinematic composition, exquisite tactile stone detail, believable plants, foreground leafy shadow framing, original design.

## living-pool.webp
Prompt: Premium architectural editorial photograph, tranquil rectangular swimming pool beside a warm ivory limestone Mediterranean modern villa, still muted blue-green water with delicate sun caustics, olive branches casting beautiful long shadows, restrained beige linen loungers, natural afternoon sunlight, elegant asymmetrical composition viewed at water level, tactile stone and warm neutral tones, expensive resort atmosphere without luxury cliches. No people, no text, no logos, no collage, original single landscape photo, 3:2 aspect. Photorealistic magazine quality.

## living-exterior.webp
Prompt: Premium editorial architectural photograph of a beautiful contemporary home exterior after meticulous cleaning, creamy limestone facade, walnut front door, immaculate broad pale stone driveway, large dark metal-framed windows, restrained olive trees and clipped green planting, warm late afternoon sun with long tree shadows. Low eye-level perspective, tactile natural stone, sophisticated quiet residential architecture, photorealistic, no people, no text, no logos, no cleaning equipment, no collage. Single original landscape 3:2 photograph, elegant architectural magazine quality.

## Restore
Pre-redesign production commit: 9c17461b20e5d1df48f79b5cadb43743fbeef770. Recoverable GitHub branch: backup/before-living-studio-20261106. Redeploy that commit in the existing Cloudflare Pages project to roll back; no data migration or domain change is required.

## Implementation verification
The homepage is a native HTML/CSS composition. Only individual photographic scenes are raster images; type specimens, website panels, navigation, services, links and the project brief remain real content. The landscape concept is initially selected. Wheel handling is limited to that panel, releases at both ends, supports reversal and small trackpad deltas, and leaves browser zoom untouched. Previous/next buttons, focused arrow/Home/End keys and horizontal touch swipes provide alternatives; vertical touch scrolling stays native. Reduced motion and the motion pause control change the designs without the turn animation.

The protected contact implementation, US$500 defined scope, client template routing, branch preview noindex/form disabling, SEO and project brief handoff remain in place. New interaction regression tests verify local wheel handling, boundaries, reversal, smooth trackpad input, keyboard, swipe, reduced motion and no form capture. The original asset and CSS/JavaScript size ceilings remain unchanged.
