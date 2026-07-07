# Decision Log

A chronological record of explicit product/engineering decisions made
during this repository's development — not a design or product spec
itself, just the record of what was decided, when, and why. Append new
entries at the bottom; do not edit or remove past entries (correct
forward, like a ledger).

---

## What is current

The most recent entry below reflects the latest explicit decision on
record. See `docs/engineering/PROJECT_STATE.md` for the current overall
baseline.

## Decisions

### D1 — Faith Preference simplified to 2 choices
Onboarding's Faith Preference step was simplified from an initial
broader design to exactly two choices ("Yes, include faith-based
encouragement" / "No thanks"), changeable at any time in Profile, never
re-prompted automatically. Reflected in the onboarding screens and
`FaithPreference` type (`'yes' | 'no' | null`).

### D2 — Sprint 1 Design Resolution: architecture preserved, tokens/motion refined
An 18-finding Design QA pass (Design/Behavioral/Visual/Accessibility) was
resolved as a token- and copy-level refinement pass explicitly bounded
to "no architecture, navigation, or flow changes except where flagged
for Board sign-off." Two items were flagged and explicitly deferred
pending Board sign-off at that time: removing History/Journey from
primary navigation, and building Recommended Sessions / Adaptive
Rhythms (both had "no implementation to evaluate" at that point).

### D3 — Today Experience (Sprint 2): Recommended Sessions & Adaptive
Rhythms approved and built
The Board explicitly approved building Recommended Sessions and Adaptive
Rhythms as a deterministic (non-AI) engine covering 4 session types
(Morning, Midday, Evening, Wind Down) — superseding the earlier
"flagged for Board sign-off, out of scope" status from D2. Implemented
in `src/utils/adaptiveRhythms.ts`; merged via PR #7.

### D4 — Sprint 3 conflict resolution: preserve all 4 session types
A newly uploaded Sprint 3 design package described "Recommended
Sessions" as choosing only between two defaults (Morning/Evening
Recenter) with duration-length variants, with no Midday Reset or Wind
Down screens at all — directly conflicting with the already-shipped
Sprint 2 implementation (D3). Rather than silently picking a side, the
conflict was surfaced explicitly. **Board ruling:** preserve all 4
session types as first-class; the approved design intent was to
eliminate a busy menu of *competing recommendations*, not to reduce the
available session types. Adaptive Rhythms determines *which existing*
session is surfaced, never *which sessions exist*. Implemented as a
confidence layer (`src/utils/recommendation.ts`) on top of the unchanged
`recommendSession()` engine; merged via PR #8.

### D5 — "Redo onboarding" not built as a separate flow
A Sprint 1 QA finding recommended a lightweight way to redo onboarding
preferences short of a full data wipe, envisioned as re-entering the
onboarding screens pre-filled. By the time Sprint 3 reached this item,
Profile already provided full in-place editing of life areas and faith
preference (built during an earlier phase). Decision: do not build a
second, parallel UI path for editing the same data — the underlying
need is already met. Recorded in
`docs/engineering/HANDOFFS/Sprint-3.md`.

### D6 — Session Completion v2: "Done" removed entirely
Sprint 3's approved design package asked that agency be preserved at
session completion with no auto-dismiss. Implemented as two options,
"Return to Today" (always Home) and "Sit a Moment" (holds the view, then
a delayed "Return to Today" link) — the previous "Done" option (return
to whatever screen was active before the session) was removed from the
component's interface entirely, not just de-emphasized.

### D7 — ESLint introduced with two calibration decisions
When ESLint was first added to the repository (Sprint 3), two React
Compiler rules (`react-hooks/refs`, `react-hooks/set-state-in-effect`)
were disabled because they flagged long-standing, correct animation
idioms used consistently across the app, and `react/no-unescaped-entities`
was disabled because React Native `<Text>` is not parsed as HTML,
making that rule miscalibrated for this codebase's large amount of
plain-English prose copy. Recorded in `eslint.config.js` inline comments
and `docs/engineering/TECH_DEBT.md` L2.

## What is deferred

Nothing is deferred within this log itself — it is a record of
decisions already made, not a queue of pending ones. Pending/open
decisions live in `docs/engineering/TECH_DEBT.md` and
`docs/engineering/ROADMAP.md`.

## What a future AI session should know

- This log only goes back as far as this repository's Sprint 1; nothing
  before that (if anything existed) is recorded.
- When a new approved document conflicts with already-shipped,
  already-decided behavior (as happened in D4), the correct move is to
  surface the conflict explicitly and get an explicit ruling — not to
  silently favor either the newest document or the existing code.
- Add new entries here at the close of every sprint, or immediately when
  a significant explicit decision is made mid-sprint. Do not retroactively
  edit past entries.
