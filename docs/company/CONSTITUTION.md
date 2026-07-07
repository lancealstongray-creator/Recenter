# Waypoint Collective / Recenter — Constitution

Foundational principles that constrain product, design, and engineering
decisions across sprints. This document compiles principles that have
already been explicitly approved and applied in this repository's
history — it does not invent new ones. Where no such record exists, the
gap is marked `Unknown — pending`.

---

## What is current

**Owning entity:** Waypoint Collective (per this repository's GitHub
metadata). No further legal, organizational, or team information is
recorded anywhere in this repository.

**Product:** Recenter — a calm, local-first daily practice app (Expo /
React Native + TypeScript). No backend, no authentication, no network
dependency for any feature.

## What has been decided

The following principles were explicitly approved (via product
specifications and design packages provided to engineering across
Sprints 1–3) and are now embedded in the shipped app. They are recorded
here as the closest thing this repository has to a constitution, sourced
from those approved documents and from the product philosophy copy
already shipped in the app itself (e.g. Profile's "About Recenter"
section):

- **No streaks, no badges, no gamification, no productivity scores.**
  Enforced structurally: `src/flags/featureFlags.ts` keeps
  `streaksAndConsistencyScores` and `badgesAndGamification` permanently
  `false`, and `src/flags/featureFlags.test.ts` asserts this.
- **No shame for missed days.** A day with no entry is simply absent
  from Archived Journey — never a red flag, a "missed" label, or an
  overdue indicator.
- **Faith is optional, never assumed, never coerced.** Exactly two
  choices at onboarding ("Yes, include faith-based encouragement" / "No
  thanks"), changeable at any time in Profile, with content (scripture,
  prayer entries in Journal) appearing only when explicitly enabled —
  "content adapts, the interface never changes shape."
- **"When confidence is low, recommend nothing."** The Recommended
  Sessions primary card is always a complete, satisfying experience on
  its own — a recommendation only ever replaces the plain default, never
  degrades it into a weaker placeholder.
- **"Adaptive Rhythms are earned, not assumed."** Any personalization
  only takes effect after a consistent pattern across a rolling
  multi-week window — never after one or two sessions. A single unusual
  day must never cause a visible personality change the next morning.
- **Notifications are invitations, never reminders, never guilt, never
  urgency, never engagement optimization.** (Notification delivery
  itself is not yet built — see `docs/engineering/PROJECT_STATE.md`.)
- **Deterministic over AI.** Recommended Sessions and Adaptive Rhythms
  are explicitly rule-based and explainable, not machine-learned. This
  is a standing engineering constraint, not just a current
  implementation detail — see
  `docs/engineering/ROADMAP.md` "Long-Term Architecture Goals."
- **Local-first, no cloud sync, no required account.** Every reflection
  stays on-device; Profile states this directly to the user
  ("Your reflections stay on this device. We designed Recenter this way
  on purpose.").
- **Every surface has exactly one emotional purpose.** Today = Presence,
  Journal = Reflection/Expression/Creation, Archived Journey =
  Perspective/Memory, Session Completion = Peace, Profile = Ownership.
  Any future feature should be able to state its one emotional purpose
  in this same frame before design work begins; if it can't, it likely
  belongs inside an existing surface rather than becoming a new one.

## What is deferred

- **Splash, Authentication, Premium/Subscription, standalone Settings,
  standalone Notification Preferences** — acknowledged in approved design
  packages as future roadmap, explicitly out of scope for Sprints 1–3.
  No design or engineering work has begun on any of them.

## What a future AI session should know

- Treat the principles above as binding unless a future Board-approved
  document explicitly supersedes one of them — do not relax them for
  convenience mid-implementation (this has already happened once: a
  Sprint 3 conflict between an uploaded design document and already-
  shipped functionality was resolved by explicit Board ruling, recorded
  in `docs/company/DECISION_LOG.md`, not by silently picking one side).
- This file does not contain a formal mission statement, company values
  document, legal structure, funding status, or team roster. **Unknown —
  pending.** If any of that material exists outside this repository, it
  should be added here rather than assumed.
- Product philosophy and legal/organizational facts are different
  categories — this file mixes them out of necessity (there is no
  separate source for the latter), but a future session should not treat
  the presence of strong product principles as evidence of a fleshed-out
  company constitution.
