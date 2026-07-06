# Recenter — Engineering Roadmap

This is an **engineering** roadmap: infrastructure, testing, refactoring,
and architecture. It deliberately does not plan product features —
product scope is decided by approved Product Specifications and Design
Packages, not by this document.

---

## Completed Milestones

- **Phase 1** — Full app build-out: 7-screen onboarding, Home, Daily
  Recenter, Evening Reflection, History, Profile. Local-first
  architecture, error-safe storage, repository pattern established.
- **8-screen onboarding rebuild** — Life areas (exactly 3), Faith
  Preference (2 choices, editable later), One Focus Setup, Notifications,
  first-real-session hand-off, optional app Tour.
- **Sprint 1 (Design Resolution Pass)** — Full design system: Instrument
  Serif + Inter typography, 2-then-3-tier elevation, motion system
  (Step Settle, Press Yield, Arrival Mark, Quiet Reveal), WCAG-AA
  contrast fix, error-safe storage surfaced via `errorMessage`.
- **QA stabilization foundation** — Jest + `jest-expo` +
  `@testing-library/react-native` test stack, mockable clock, GitHub
  Actions CI, QA test plan/coverage-map/checklists, bug report template.
- **Today Experience (Sprint 2)** — Deterministic Recommended Sessions
  v1 (4 session types: Morning, Midday, Evening, Wind Down), Adaptive
  Rhythms time-window engine, shared Session Completion v1, Home rebuilt
  to spec order with all 5 required empty states.
- **Sprint 3** — Navigation rebuilt to Today/Journal/Profile; Journal
  (new freeform-writing feature); Archived Journey reframing (season
  grouping, perspective line, representative excerpts); confidence-based
  Recommended Sessions layer; Session Completion v2 (Return to
  Today / Sit a Moment, `elevation.hero`); ESLint introduced and wired
  into CI; pre-merge architecture consistency review.

## Current Repository Maturity

- **Type safety:** Full TypeScript, `tsc --noEmit` clean, no `any` used
  as an escape hatch in reviewed code paths.
- **Linting:** ESLint (flat config) wired into `npm run verify`, the
  Husky pre-commit hook, and CI. Zero errors as of Sprint 3's close.
- **Automated tests:** 65 tests across 8 suites, covering the data/logic
  layer where the QA rules actually live (dedup, no data loss, resume,
  time math, flag hygiene, deterministic recommendation, confidence
  layer, season/perspective date formatting, Journal persistence).
- **Manual QA:** Full-flow UI journeys documented in
  `qa/smoke-checklist.md` and `qa/regression-checklist.md`, traceable to
  stable QA IDs in `qa/TEST_PLAN.md`.
- **CI:** GitHub Actions runs typecheck, lint, test, and a production web
  export build on every push and PR to `main`.
- **Architecture hygiene:** Repository pattern verified with zero
  screen-level storage access; no orphaned routes; no duplicate
  navigation helpers, data models, or design tokens as of the Sprint 3
  architecture review.

Overall: the repository is in a genuinely mergeable, CI-green,
production-buildable state after every sprint so far — this maturity
should be preserved, not just reached once.

## Upcoming Engineering Priorities

In rough priority order, engineering-only (no product scope):

1. **Extract a shared reveal-animation hook** (see `TECH_DEBT.md` M1) —
   removes real code duplication across `ArrivalMark`/`QuietReveal`/
   `StepFade`/`PageTurn` without changing any component's public API or
   visual behavior. Should be its own isolated PR with full visual
   re-verification.
2. **Season-label year disambiguation** (see `TECH_DEBT.md` M2) — small,
   self-contained, but worth doing before the app has real users with
   more than a year of history.
3. **Archived Journey data completeness** (see `TECH_DEBT.md` M3) —
   extend to include Midday Reset / Wind Down entries, matching the
   pattern already used for Daily Recenter / Evening Reflection.
4. **Component consolidation candidate: `Card`.** Every screen still
   hand-rolls its own "surface + radius.lg + padding.xl + elevation.soft"
   block inline (flagged as a future consolidation candidate as far back
   as the original Sprint 1 design audit). Not urgent, but worth doing
   once no further elevation-tier changes are anticipated, so the shadow
   tier is chosen deliberately per card rather than copy-pasted.
5. **Dependency audit.** Run a proper unused-dependency check (e.g.
   `depcheck`) with manual verification of framework peer dependencies
   before removing anything — see `TECH_DEBT.md` L4 for why this wasn't
   done blindly during Sprint 3.

## Infrastructure Work

- **CI coverage reporting.** `npm test -- --ci --coverage` already runs
  in CI; nothing currently consumes or gates on the coverage output.
  Consider a coverage floor once the test suite is more mature.
- **Native build validation.** CI currently only validates the web
  export (`expo export --platform web`). No iOS/Android build or
  simulator smoke test runs in CI. This is a real gap if/when native
  distribution becomes a near-term goal.
- **Component-level UI test automation.** `qa/README.md` documents why
  full component/navigation-level RN testing (mocking React Navigation,
  AsyncStorage, and Expo font loading together) hasn't been built yet —
  still the single largest QA automation gap. Manual Playwright-on-web
  walkthroughs have substituted for this through Sprints 2 and 3.

## Refactoring Opportunities

- Shared reveal-animation hook (above).
- `Card` component extraction (above).
- The four `save*Entry` repository functions (`saveDailyEntry`,
  `saveEveningEntry`, `saveMiddayEntry`, `saveWindDownEntry`) are
  structurally identical (load existing map, merge by date key, write
  back). A generic `saveKeyedEntry<T>(key, date, entry)` helper could
  remove this repetition — low priority, since the current explicit
  functions are easy to read and test individually, and this predates
  Sprint 3.

## Long-Term Architecture Goals

- **Preserve the repository pattern as the app grows.** Any future
  feature (native notifications actually firing, a future cloud-sync
  opt-in, etc.) should keep the `Screen → Context → Repository →
  Storage` boundary intact rather than introducing a second state
  management pattern.
- **Keep Adaptive Rhythms deterministic.** If genuine personalization
  ever becomes a priority, it should remain rule-based and explainable
  (per the Board's own stated principle: "when logic ever grows complex
  enough to need a separate 'why am I seeing this' screen, that's a
  signal the recommendation itself has gotten too clever") rather than
  introducing a black-box model.
- **Keep the design token system the single source of truth.** As new
  surfaces are added, extend `theme.ts` rather than reintroducing
  hand-picked values — the Sprint 3 architecture review caught one such
  case (`SessionPickerSheet`'s backdrop color) and fixed it before merge;
  future reviews should keep checking for this pattern.
