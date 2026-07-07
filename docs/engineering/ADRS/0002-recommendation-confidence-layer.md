# ADR-0002: Confidence layer kept separate from session-type selection

**Status:** Accepted (Sprint 3, `src/utils/recommendation.ts`)

## Context

Sprint 2 shipped a deterministic Recommended Sessions engine
(`src/utils/adaptiveRhythms.ts`) that picks one of 4 session types
(Morning, Midday, Evening, Wind Down) by scanning forward from the
current time window, never resurfacing a missed session. A newly
uploaded Sprint 3 design package described a different mechanism: a
single confidence-based recommendation defaulting to only two session
types, with no Midday/Wind Down as distinct types at all — directly
conflicting with the already-shipped Sprint 2 engine and functionality.

The Board's explicit ruling (see `docs/company/DECISION_LOG.md` D4) was
to preserve all 4 session types as first-class product surfaces, and to
have Adaptive Rhythms determine *which existing* session is surfaced,
never *which sessions exist*.

## Decision

Implement the confidence behavior as a separate layer
(`utils/recommendation.ts`) that:

1. Calls the existing, unchanged `recommendSession()` to get the session
   type — this call and its logic are not modified in any way.
2. Separately computes a `confident: boolean` by checking whether that
   same session type was completed on at least 5 of the last 7 calendar
   days (excluding today).
3. Returns `{ sessionType, confident, reasonCopy? }` — `reasonCopy` is
   only set when confident, and is a fixed, honest, per-type sentence
   (never a score or percentage).

`getRecommendation().sessionType` is guaranteed to always equal what
`recommendSession()` alone would have returned, for the same inputs —
enforced by test assertions in `recommendation.test.ts`, not just by
convention.

## Consequences

- Confidence can only ever change Home's *copy* ("Suggested for you" vs.
  the plain default label + blurb) — it can never cause a different
  session type to be picked. This makes the two concerns independently
  testable and independently reasoned about.
- A future sprint that wants smarter/richer personalization should
  extend `recommendation.ts` (or add a new layer following the same
  pattern), not modify `adaptiveRhythms.ts`'s core scan logic, unless a
  future Board decision explicitly changes the underlying selection
  rule itself.
- If a future design package again describes a system that appears to
  reduce or restructure the 4 session types, treat that as a potential
  repeat of the Sprint 3 conflict — surface it explicitly rather than
  silently reconciling it either way.
