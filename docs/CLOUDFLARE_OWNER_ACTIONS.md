# Remaining Cloudflare actions — EZERWRIGHT

Email Routing for `hello@ezerwright.com` is configured and successfully tested, as confirmed by the owner on 13 October 2026. Leave it in place. Production changes, main-branch updates and deployment are explicitly authorized. The owner’s existing signed-in browser is separate from the agent’s signed-out cloud browser. No further Google sign-in retries or credential changes.

The GitHub integration still denies writes with HTTP 403. Release only after the corrected source is available in `tituswas/ezerwright-site`.

## 1. Create the Turnstile widget

Open **Turnstile** > **Add widget**. Name it **EZERWRIGHT Contact**; allow hostname `ezerwright.com`; choose **Managed** mode; leave pre-clearance disabled. Create it. Keep the sitekey for the Pages build and the secret key for the contact Worker's runtime. Never put the secret in GitHub, the website configuration, or chat.

## 2. Configure the contact Worker after source is available

Open **Workers & Pages** > create/import a **Worker** from GitHub. Select `tituswas/ezerwright-site`, `main` after the corrected source has been merged there, root directory `/`, and Worker name **ezerwright-contact**. Use the free plan; do not enable paid Email Sending.

In the Worker's **Settings > Build**:

| Setting | Value |
| --- | --- |
| Build command | `npm run contact:check` |
| Deploy command | `npm run contact:deploy` |
| Production branch | `main`, containing the corrected source and these scripts |
| Build variable `NODE_VERSION` | `24.19.0` |
| Build secret `CONTACT_TO` | **OWNER_APPROVED_DESTINATION** |

Set build settings and the destination before running the corrected source's deploy command. The deploy command generates a private recipient-restricted configuration. Cloudflare's normal build authorization stays in your account; do not copy its API token into chat or the repository.

In **Settings > Variables and Secrets**, add these runtime secrets, then use **Deploy** to apply them:

| Secret name | Value |
| --- | --- |
| `TURNSTILE_SECRET` | The secret key from step 1 |
| `RATE_LIMIT_SALT` | A new random string of at least 32 characters |

The deployment configuration supplies runtime `CONTACT_FROM=hello@ezerwright.com`, `CONTACT_TO=OWNER_APPROVED_DESTINATION`, the recipient-restricted **SEND_EMAIL** binding, **CONTACT_RATE_LIMIT** at 5 requests per 60 seconds, and the route **ezerwright.com/api/*** in zone **ezerwright.com**. Verify these in the Worker's settings after deployment. The route must be proxied through Cloudflare. Keep the existing Pages domain/DNS in place; do not replace it with a Worker custom domain. No public workers.dev or preview endpoint is required.

## 3. Configure the existing Pages production build

Open **Workers & Pages > ezerwright-site > Settings**. Keep the Astro preset, **Build command `npm run build`**, **Output directory `dist`**, and the existing custom domain `ezerwright.com`.

Under **Environment variables**, select **Production** and set:

| Variable | Value |
| --- | --- |
| `NODE_VERSION` | `24.19.0` |
| `SITE_CONFIG` | `src/config/production.json` |
| `TURNSTILE_SITE_KEY` | The public sitekey from step 1 |
| `PRIVACY_APPROVED` | `true` (production release is authorized) |

Do not set the Turnstile secret or inbox recipient in the Pages build environment. After the backend is deployed and the corrected commit is in the production branch, trigger/retry the Pages production deployment for that commit. Confirm the displayed commit matches the corrected source, rather than the original baseline.

## 4. Verify contact-form delivery

After the corrected website and contact Worker are deployed, submit a clearly labeled synthetic enquiry at **https://ezerwright.com/contact/**, complete Turnstile, and confirm the separate enquiry email arrives in **OWNER_APPROVED_DESTINATION** with the visitor address as Reply-To. Check the Cloudflare email/Worker activity if it fails. A green routing badge, a passing unit test, or an HTTP 200 is not proof of inbox delivery.

Sources: Cloudflare [Turnstile dashboard](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/), [Workers Builds settings](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [runtime secrets](https://developers.cloudflare.com/workers/configuration/secrets/) and [Pages build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/).
