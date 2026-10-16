# Pre-merge deployment assessment — historical 16 October 2026 snapshot

**Current update:** the owner subsequently confirmed a successful production deployment and actual form email delivery. The failed-check observations below are historical, not a current outage report. Preserve that working system; use the [current redirect repair and owner release checklist](../CLOUDFLARE_REDIRECTS.md). This task authorizes no production changes.

**Historical recommendation: hold merge.** Local code verification can pass while merging changes the live website. The Cloudflare Git integration is confirmed active; its exact production branch and automatic-production controls cannot be read in this session. Treat merging PR #1 into `main` as potentially production-affecting. No deployment setting was changed.

## Read-only findings

- No `.github/workflows` files are tracked on either the feature branch or `main`. The remote main workflows directory returns 404 and the GitHub Actions runs API reports zero runs. There is no repository-defined Actions deployment workflow to inspect. This does **not** establish that Cloudflare is disconnected.
- The live main-branch API reports `protected: false`, protection disabled, and no required status-check contexts. The ruleset collection returns `[]`. The dedicated branch-protection endpoint returns 403 (`Resource not accessible by integration`), so administration-level details cannot be independently inspected. No protection/ruleset was added or modified.
- The main commit `c0e81e7` has a completed **Cloudflare Pages / failure** check from 13 October 2026. The prior PR tip `21589b3` has the same failed Cloudflare Pages check from 16 October 2026. Their app is `cloudflare-workers-and-pages`. These observations establish that the repository has triggered hosted build attempts on both main and the feature branch. They do not establish a successful deployment or the failure's cause.
- `docs/CLOUDFLARE_OWNER_ACTIONS.md` documents the existing `ezerwright-site` Pages project, `npm run build`, output `dist`, production build variables and domain `ezerwright.com`. It also documents a separately deployed contact Worker and `main` for that Worker. This historical setup guidance is not a current dashboard settings snapshot or present authorization to release.
- The existing source gates reject demo-mode Pages builds and production builds without required approved configuration/key settings. Once valid production settings exist in Cloudflare, those validation gates are **not** a separate manual merge/deploy approval barrier.

GitHub endpoint results and check references are summarized in [deployment-assessment.json](deployment-assessment.json). No Cloudflare account API/dashboard integration is available here, and hosted build logs were not accessible through the GitHub check summary. Do not infer a root cause for the failed hosted builds from local test results.

## Review-only branch update

Cloudflare's [GitHub integration documentation](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/) documents a `[CF-Pages-Skip]` commit-message prefix that omits the associated Pages deployment without changing settings. This review commit uses that prefix, plus `[skip ci]`; local tests still run normally. No Cloudflare deploy, hosted-build retry/rebuild, or workflow-dispatch API/command was called. The prefix applies to this commit, not an eventual independently created merge/squash commit, and is not evidence that production deployment is disabled.

## Owner review before merge

1. Inspect the current Pages production branch, automatic-production setting, preview branch controls and any deploy hooks. Confirm whether merging into `main` will release production.
2. Inspect the actual Cloudflare build logs for the failed main/PR checks and resolve the failure through a separately authorized process. No live build was retried in this task.
3. Confirm any separately configured contact Worker build connection and trigger policy. Preserve recipient restrictions, Turnstile, rate limits and the static/Worker separation.
4. Make the merge/release decision explicitly with that knowledge. Do not interpret a locally passing suite, absence of Actions workflows or skipped check as production-release approval.

No merge, production credential change, paid API call, email send, or intentional deployment is part of this review.
