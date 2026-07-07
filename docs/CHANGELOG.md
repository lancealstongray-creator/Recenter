# Recenter — Changelog

High-level release history for Waypoint Collective / Recenter. This is
**not** technical documentation — for implementation detail, see
`docs/engineering/`. Audience: executives, future AI sessions, future
developers who need the story of the product without reading every
commit.

Entries use whatever name the work was actually given at the time
(some milestones predate formal "Sprint N" numbering) — see
`docs/company/DECISION_LOG.md` for the decision-level detail behind any
entry marked with a Board decision.

---

## Phase 1 — Initial Build
**2026-07-03** · PR #1

First working build of Recenter: 7-screen onboarding, Home, Daily
Recenter, Evening Reflection, History, Profile. Local-first, no
backend.

- **Features:** onboarding flow, daily check-in, evening reflection,
  history log, profile screen.
- **Architecture:** established the repository pattern (Screen →
  Context → Storage) used ever since.
- **Board decisions:** none recorded at this stage.

## Premium Design Refinement
**2026-07-06** · PR #2

First design elevation pass — moved the app from a functional build
toward a "premium, restorative experience" look and feel.

- **Features:** none (visual/tonal refinement only).
- **Architecture:** no structural change.
- **Board decisions:** none recorded.

## Onboarding Rebuild — 8-Screen Spec
**2026-07-06** · PR #3

Onboarding rebuilt to a fuller 8-screen specification.

- **Features:** expanded onboarding flow.
- **Architecture:** no structural change beyond the onboarding screens
  themselves.
- **Board decisions:** none recorded.

## Onboarding Refinement v2
**2026-07-06** · PR #4

Faith Preference simplified; a one-time "You're Ready" completion
screen and an optional app Tour were added.

- **Features:** Faith Preference simplified to 2 choices (see
  `docs/company/DECISION_LOG.md` D1); "You're Ready" first-session
  screen; optional 4-stop app Tour.
- **Architecture:** no structural change.
- **Board decisions:** D1 — Faith Preference simplified to exactly 2
  choices, editable later.

## Sprint 1 — Design Resolution Pass
**2026-07-06** · PR #5

A full Design QA self-critique (18 findings across Usability,
Behavioral, Visual, Accessibility) resolved into a token- and
copy-level refinement pass, explicitly bounded to preserve existing
architecture and navigation.

- **Features:** none new (refinement of existing screens only).
- **Architecture:** full design token system (Instrument Serif + Inter
  typography, 2-tier elevation, motion system — Step Settle, Press
  Yield, Arrival Mark, Quiet Reveal), WCAG-AA contrast fix, error-safe
  storage layer (`StorageResult` pattern) introduced.
- **Board decisions:** D2 — architecture/navigation preserved; two
  items (removing History/Journey from primary navigation, building
  Recommended Sessions/Adaptive Rhythms) explicitly flagged as
  out of scope pending future Board sign-off.

## QA Stabilization Foundation
**2026-07-06** · PR #6

A dedicated pause on feature work to establish a repeatable test/debug/
verify workflow before further product development.

- **Features:** none (infrastructure only).
- **Architecture:** Jest + `jest-expo` + `@testing-library/react-native`
  test stack, mockable clock for deterministic date/time tests, GitHub
  Actions CI, Husky pre-commit hook, full QA documentation
  (`qa/TEST_PLAN.md`, coverage map, smoke/regression checklists).
- **Board decisions:** none recorded.

## Sprint 2 — Today Experience
**2026-07-06** · PR #7

The Board approved building Recommended Sessions and Adaptive Rhythms —
superseding Sprint 1's "out of scope, pending sign-off" status for
those two items.

- **Features:** Home rebuilt around a single recommended-session card;
  4 session types (Morning, Midday, Evening, Wind Down); a shared
  Session Completion screen; all 5 required empty states.
- **Architecture:** deterministic (non-AI) recommendation engine
  (`adaptiveRhythms.ts`) — a pure time-window scan, "never recommend a
  missed session."
- **Board decisions:** D3 — Recommended Sessions and Adaptive Rhythms
  approved as in-scope, to be built as a deterministic engine.

## Sprint 3 — Today / Journal / Profile Navigation
**2026-07-06** · PR #8

Navigation rebuilt around three tabs; a genuinely new Journal feature;
the former History/Journey screen reframed as Archived Journey; a
confidence layer added on top of Sprint 2's recommendation engine;
Session Completion redesigned.

- **Features:** Journal (freeform writing + unified reflection feed);
  Archived Journey (season grouping, perspective line, representative
  excerpts, no counts); Session Completion v2 ("Return to Today" /
  "Sit a Moment," no auto-dismiss); confidence-based "Suggested for
  you" copy on the recommended session card.
- **Architecture:** new `JournalEntry` data model/storage; new
  `recommendation.ts` confidence layer (does not change which session
  type is chosen, only the card's copy); `elevation.hero` design tier;
  ESLint introduced to the repository for the first time and wired into
  CI.
- **Board decisions:** D4 — a real conflict between the uploaded Sprint
  3 design package (which implied reducing to 2 session types) and
  already-shipped functionality was resolved by explicit Board ruling:
  all 4 session types preserved as first-class; Adaptive Rhythms
  determines which *existing* session is surfaced, never which sessions
  exist. D5 — a separate "redo onboarding" flow was deliberately not
  built (Profile's existing in-place editing already meets the need).
  D6 — Session Completion's "Done" option removed entirely, replaced by
  the two-option v2 design.

## Engineering Documentation Baseline
**2026-07-06**

Established `docs/engineering/` as living engineering memory following
Sprint 3's close: current project state, technical debt register, and
roadmap, plus a permanent point-in-time Sprint 3 handoff.

- **Features:** none (documentation only).
- **Architecture:** no change. A pre-merge architecture consistency
  review was performed as part of this pass (see
  `docs/engineering/HANDOFFS/Sprint-3.md`), removing one unused asset
  and one duplicated color value — both zero-risk, no behavior change.
- **Board decisions:** none new; D7 (ESLint calibration) recorded
  retroactively here.

## GitHub Memory Database
**2026-07-07**

Extended documentation across every function, not just engineering:
Company, Product, Design, Research, Testing, Marketing, Business, and
Operations state documents, plus two backfilled Architecture Decision
Records.

- **Features:** none (documentation only).
- **Architecture:** no change.
- **Board decisions:** none new — this pass compiled decisions already
  made into `docs/company/DECISION_LOG.md` and marked genuinely unknown
  areas (research, marketing, business model, operations/deployment) as
  such rather than inventing content for them.

---

## What a future AI session should know

- This changelog is sprint/milestone-level only — it does not replace
  `docs/company/DECISION_LOG.md` (decision-level detail) or
  `docs/engineering/HANDOFFS/` (full engineering handoffs).
- Add a new entry here at the close of every future sprint, following
  the same shape (Summary / Features / Architecture / Board decisions),
  regardless of whether that sprint is given a numbered name.
