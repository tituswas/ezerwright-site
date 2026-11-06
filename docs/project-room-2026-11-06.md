# Project Room

Rollback: 07833ac9676a100e8eb6cffaa0f60ea3d633b159. Restore this commit to remove the new interface without any database/configuration rollback.

The homepage now offers a native dialog with three public preference choices (service, priority, visual direction) and a live summary. The primary hero action and floating launcher both have ordinary contact links if scripting/dialog support is unavailable. Keyboard focus stays inside the native modal; Escape and the explicit close control return focus to the opener. There is a direct contact escape route throughout.

No identity, contact details, new records or notifications are collected in this interface. Fixed allowlisted preferences continue to the existing protected contact form, where the visitor can edit the message. Price is derived from the current offer configuration; improvements/updates remain separately scoped and quoted. Only known visual labels can be added to the starter message; untrusted query text is never interpolated as HTML. Existing visitor drafts are preserved.

Original artwork, gallery, public routes, authentication/security configuration, contact backend, recipients and domain are unchanged. No dependency is added. Regression coverage includes tailored choices, modal fallback, price integrity and safe contact handoff, plus the existing application suite. Actual external submission is intentionally not performed for this presentation-only change.
