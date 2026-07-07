# Recenter — Engineering Workflow

The permanent process every future session (human or AI) follows when
starting or closing a unit of work on this repository. This document is
itself part of the reading order it defines — read it once, then follow
it every time.

---

## Every Session Starts Here

1. Read **[`docs/INDEX.md`](../INDEX.md)** first — it is the canonical
   navigation guide for this repository's documentation.
2. Follow the **Recommended AI Reading Order** defined at the bottom of
   `docs/INDEX.md`. Stop early once you have enough context for the task
   at hand — the order is priority, not a mandatory full read every
   time.

Do not restore context from a previous conversation instead of this
process. Conversations end; the documentation in this repository is the
durable memory.

---

## Sprint Start

Before writing any implementation code:

1. Read `docs/INDEX.md` and follow its documented reading order.
2. Inspect the repository directly (don't trust memory of a prior
   session) — confirm the current state of the code matches what the
   documentation claims.
3. Summarize the current baseline in your own words before proposing
   changes — this surfaces any mismatch between documentation and
   reality early.
4. Review the Engineering Implementation Package (or equivalent
   approved spec) for the work about to begin.
5. Only then begin implementation.

## Sprint End

Before declaring a sprint complete:

1. **Update every documentation file affected by the sprint** —
   `docs/product/PRODUCT_STATE.md`, `docs/design/DESIGN_STATE.md`,
   `docs/engineering/PROJECT_STATE.md`, `docs/engineering/TECH_DEBT.md`,
   etc., wherever the sprint's work actually changed what those files
   describe.
2. **Do not update documents unrelated to the work performed.** A sprint
   that only touched engineering should not edit
   `docs/marketing/MARKETING_STATE.md` just because it exists.
3. **Update `docs/CHANGELOG.md`** with the completed sprint, following
   the existing entry shape (Summary / Features / Architecture / Board
   decisions).
4. **Update department state documents only where meaningful changes
   occurred** — a state file with nothing new to say should be left
   alone, not padded with restated information.
5. **Create a new Operations sprint handoff** if the sprint touched
   deployment, infrastructure, or CI in a way worth a permanent record
   (`docs/operations/HANDOFFS/`). Purely feature/engineering sprints
   still get an engineering handoff (`docs/engineering/HANDOFFS/`)
   following the pattern in `Sprint-3.md` — one file per sprint, never
   edited after the fact.
6. **Commit documentation together with sprint closeout** — the code
   change and its documentation update belong in the same close-out,
   not a separate follow-up pass.

---

## What a future AI session should know

- This file defines *process*, not project state. If you're looking for
  what's actually built, go to `docs/engineering/PROJECT_STATE.md`
  instead.
- The reading order in `docs/INDEX.md` is the canonical one — if this
  file and `docs/INDEX.md` ever appear to disagree, treat `docs/INDEX.md`
  as authoritative and flag the discrepancy for correction.
- "Sprint End" documentation updates are not optional busywork — several
  past conflicts in this project's history (see
  `docs/company/DECISION_LOG.md` D4) happened specifically because a
  later session didn't know what an earlier one had already decided.
  Keeping these documents current is how that stops repeating.
