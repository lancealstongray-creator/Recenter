# Recenter — Testing State

Summarized from `qa/` (the authoritative source — this file is a pointer
and summary, not a replacement). See `qa/README.md` for the full
workflow, `qa/TEST_PLAN.md` for every scenario and its QA ID.

---

## What is current

**Automated:** 65 Jest tests across 8 suites (as of Sprint 3's close),
covering the data/logic layer where the QA rules actually live:

- `src/utils/pick.test.ts` — deterministic daily picks
- `src/utils/date.test.ts` — date-key formatting, midnight/year rollover,
  greeting boundaries, season labels, months-since perspective line
- `src/storage/storage.test.ts` — profile load/save/merge, entry dedup
  (daily/evening/midday/windDown), Journal append, error-safety
- `src/context/AppContext.test.tsx` — session dedup, onboarding
  persistence/resume, onboarding hand-off, reset, relaunch survival,
  focus-complete toggle, Journal entries
- `src/navigation/types.test.ts` — onboarding step-index resume mapping
- `src/flags/featureFlags.test.ts` — every Phase 2/3 flag stays `false`
- `src/utils/adaptiveRhythms.test.ts` — time-window + forward-scan
  recommendation logic, never-recommend-missed rule
- `src/utils/recommendation.test.ts` — confidence layer: threshold
  behavior, today never counts toward its own confidence, a single
  unusual day doesn't flip it, confidence never changes which session
  type is recommended

**Manual:** Full-flow UI journeys documented in `qa/smoke-checklist.md`
(pre-release, ~10 minutes) and `qa/regression-checklist.md` (deeper,
data-integrity-focused, for changes touching context/storage/date/nav).
Every manual scenario is traceable to a stable QA ID in
`qa/TEST_PLAN.md`, cross-referenced in `qa/coverage-map.md`.

**CI:** GitHub Actions (`.github/workflows/ci.yml`) runs on every push
and PR to `main`: typecheck → lint → `npm test -- --ci --coverage` →
production web export build. All four must pass; none are currently
skipped or allowed to fail.

**Pre-commit:** Husky hook runs `npm run verify`
(`typecheck && lint && test`) locally before every commit.

## What has been decided

- **The data/logic layer is automated; screen/navigation rendering is
  not**, and this is a deliberate choice, not an oversight — see
  `qa/README.md`'s "Why full UI/E2E automation isn't in place yet."
  Full component/navigation-level RN testing would require mocking React
  Navigation's native stack/tab navigators and Expo's font loading
  together, judged a larger effort than any stabilization pass to date
  has called for.
- QA rules that must never be violated (from `qa/TEST_PLAN.md`): no
  duplicate session completions, no reflection/session data loss,
  Recommended Sessions must behave predictably, Adaptive Rhythms must
  never create confusion/shame/broken state, missed days must not
  punish, returning users must resume without friction, time-based
  recommendations must survive midnight/timezone/missed-day edge cases.

## What is deferred

- **Component/navigation-level automated tests** for the three
  highest-risk flows (Daily Recenter, Evening Reflection, Onboarding
  resume) — recommended next QA milestone per `qa/README.md`, blocked on
  adding test IDs to key interactive elements first.
- **Native (iOS/Android) build validation in CI** — only the web export
  is currently validated; no simulator/device smoke test runs in CI (see
  `docs/engineering/ROADMAP.md`).
- Playwright-based manual verification has been used repeatedly
  throughout Sprints 2–3 (screenshots + console-error checks against a
  running `expo start --web` instance) but is a manual, ad hoc process
  run during development, not a committed, repeatable script in this
  repository.

## What a future AI session should know

- Before changing anything in `src/context/AppContext.tsx`,
  `src/storage/storage.ts`, `src/utils/date.ts`, or `src/navigation/**`,
  run `qa/regression-checklist.md`'s automated section first, then its
  manual section for anything touching a Critical-severity QA ID.
- Every new feature should get: a QA ID in `qa/TEST_PLAN.md`, an entry in
  `qa/coverage-map.md`, and — if it touches the data/logic layer — a real
  Jest test, not just a manual checklist line. This has been the pattern
  every sprint so far (Sprint 2 added QA-TOD/HOME/COMPLETE/EMPTY IDs;
  Sprint 3 added QA-NAV/JOURNAL/ARCHIVE/REC/COMPLETE2 IDs) and should
  continue.
- `npm run verify` (typecheck + lint + test) is the fast local gate;
  `npm run build` is the slower one that also validates the production
  web export. Both should pass before any commit that isn't docs-only.
