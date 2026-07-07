# Recenter — Marketing State

## What is current

**No marketing artifacts exist in this repository.** There is no
positioning document, messaging framework, launch plan, app store
listing copy, brand guideline (beyond the design token system, which is
a design/engineering artifact — see `docs/design/DESIGN_STATE.md`),
website, or growth/acquisition plan committed anywhere in this codebase.

The only marketing-adjacent material is the app's own **user-facing
voice and copy**, which is a product/design concern, not a marketing
one: the app's tone is calm, specific, human, "a trusted mentor who
feels like a close friend" (per design package language recorded in
`docs/company/DECISION_LOG.md` and `docs/design/DESIGN_STATE.md`'s voice
conventions). This governs in-app copy; it does not constitute external
marketing messaging.

## What has been decided

Nothing marketing-specific. The product philosophy in
`docs/company/CONSTITUTION.md` (no streaks, no gamification, no shame,
faith-optional, local-first/private) would likely inform any future
marketing positioning, but no one has made that connection explicit in
any document available to this repository.

## What is deferred

Everything — there is no marketing workstream visible from this
repository at all.

## What a future AI session should know

- Do not draft App Store/Play Store listing copy, ad copy, a landing
  page, or a press release based on inference from the app's in-product
  voice — that would be inventing marketing decisions, not reporting
  them.
- If a marketing brief or brand guideline exists outside this
  repository, it hasn't been shared with engineering as of this writing.
  This file should be replaced with real content the moment one is
  provided, not extrapolated from product copy in the meantime.
- App metadata that does exist (`app.json`'s `name`/`slug`: "RecenterApp")
  is a technical identifier, not a considered public-facing product name
  decision — don't treat it as marketing-approved branding.
