# Feature flags

`featureFlags.ts` lists every Phase 2 / Phase 3 feature as an explicit,
named, disabled flag. Phase 1 code must never import a flag and branch into
real UI for it — the flags exist purely as a checklist for future phases.

When a Phase 2/3 feature is actually built, flip its flag and wire the UI
behind a runtime check (`if (FEATURE_FLAGS.phase2.x) { ... }`) rather than
deleting the flag.
