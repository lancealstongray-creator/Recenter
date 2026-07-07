# Recenter — Operations State

## What is current

**There is no deployed instance of this app anywhere.** Recenter runs
today only as a local development build (`npm run web` / `npm start` via
Expo). No production deployment, no app store submission, no hosting,
no distribution channel of any kind exists.

**CI:** GitHub Actions (`.github/workflows/ci.yml`) runs on every push
and PR to `main`: `npm ci` → typecheck → lint → `npm test -- --ci
--coverage` → `npm run build` (production web export via `expo export
--platform web`). This is the only automated operational process in the
repository. It validates the build; it does not deploy it anywhere.

**Pre-commit:** Husky (`prepare: "husky"` in `package.json`) runs `npm
run verify` locally before every commit, blocking commits that fail
typecheck/lint/test.

**No monitoring, alerting, logging, or crash reporting** is configured —
there is no such infrastructure to monitor, since nothing is deployed.

**No environment variables are required.** `.env.example` (if present)
documents zero required vars as of the last QA stabilization pass.

## What has been decided

- CI is the single quality gate for `main`; there is no staging
  environment, no manual QA sign-off gate beyond the checklists in
  `qa/`, and no release/versioning process beyond `package.json`'s
  `version: "1.0.0"` (unchanged since Phase 1 as far as this repository
  shows).
- Git workflow: every feature ships on a `claude/<name>` branch, opened
  as a PR, validated by CI, then merged into `main`. `main` is treated as
  the always-releasable baseline (see
  `docs/engineering/PROJECT_STATE.md`).

## What is deferred

- **Everything related to actual deployment or distribution**: no
  hosting choice made, no app store account/listing, no CI/CD pipeline
  beyond validation (no automated deploy step exists or is planned in
  any document available to this repository).
- **Native build validation in CI** — only the web export is checked;
  no iOS/Android build step exists in CI (see
  `docs/engineering/ROADMAP.md`).
- **Incident response / on-call process** — not applicable yet; nothing
  is live to have an incident.

## What a future AI session should know

- Do not describe this app as "in production" or "deployed" anywhere —
  it is not, as of this writing. If that changes, this file must be
  updated with the real hosting/distribution facts, not assumptions.
- `docs/operations/HANDOFFS/` exists for future operational handoffs
  (deployment setup, infra changes, incident postmortems) — distinct
  from `docs/engineering/HANDOFFS/`, which is for sprint-close
  engineering summaries. It is currently empty; nothing operational has
  happened yet to hand off.
- If a future sprint introduces actual deployment, that is a significant
  operational change deserving its own handoff document in this
  directory, not just a line in `PROJECT_STATE.md`.
