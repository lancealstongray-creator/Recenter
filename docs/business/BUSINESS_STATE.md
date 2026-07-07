# Recenter — Business State

## What is current

**No business model, monetization, or commercial artifacts exist in this
repository.** There is no pricing model, no subscription tiers, no
payment integration, no revenue reporting, no unit economics, and no
funding/legal documentation committed anywhere in this codebase.

Structurally, the app today has **no monetization mechanism of any
kind**: no backend, no authentication, no account system, no in-app
purchase or subscription integration. Every feature ships fully local
and free of any commercial gate.

## What has been decided

- **"Premium/Subscription" is explicitly acknowledged as approved future
  roadmap** in Sprint 3's design package, alongside Splash,
  Authentication, standalone Settings, and standalone Notification
  Preferences — but "remains out of this sprint's deliverables — no
  design work has been started on them yet." No business model has been
  attached to what "Premium" would even mean (feature-gated tiers vs.
  one-time purchase vs. something else) — only the name has been
  mentioned.
- No decision has been made about whether Recenter will ever require an
  account or backend at all; the current local-first architecture is a
  stated product/engineering principle (see
  `docs/company/CONSTITUTION.md`), not merely a placeholder pending a
  future business model.

## What is deferred

Everything commercial: pricing, monetization mechanism, payment
processor integration, account system, legal/ToS/privacy policy
documents (beyond the one in-app trust sentence about local storage),
and any go-to-market or business plan.

## What a future AI session should know

- **Do not assume a subscription or any specific monetization model.**
  "Premium/Subscription" is a named future roadmap item, not a specified
  one — no pricing, tiering, or feature-gating decision has been made.
- If a future sprint's design package introduces Authentication or
  Premium/Subscription, that will very likely require new architectural
  decisions this repository's current local-first, no-backend
  constraints do not yet accommodate (see
  `docs/engineering/PROJECT_STATE.md`) — flag that as a significant
  architecture change requiring its own review, not a routine feature
  addition.
- Do not draft pricing copy, terms of service, or a privacy policy
  without an explicit source document — none exists here to draw from.
