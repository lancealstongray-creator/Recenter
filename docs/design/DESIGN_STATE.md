# Recenter — Design System State

The design system as actually implemented in `src/theme/theme.ts` and the
shared components in `src/components/`. This reflects shipped tokens and
patterns, not aspirational ones.

---

## What is current

### Color
Warm-ivory / charcoal / sage palette (`src/theme/theme.ts`):
`background #FAF8F4`, `backgroundEvening #F5F1EA` (Evening Reflection
only), `surface #FFFFFF`, `surfaceMuted #F2EFE9`, `border #E7E2D9`,
`borderStrong #D8D1C4` (input focus), `textPrimary #2B2A26`,
`textSecondary #6F6A61`, `textTertiary #8A8377`, `accent #6E8B6E`,
`accentDark #516750`, `accentSoft #E4EAE1`, `error #B3564B` (muted
terracotta, deliberately not alarm-red), `errorSoft #F3E4E1`.
`textTertiary` was specifically tuned to ~3.1:1 contrast to pass WCAG AA
for the label/caption text it's used on.

### Typography
Deliberately shallow hierarchy — one hero, one display, one title, one
quote, one body, one label, one caption. Instrument Serif for
hero/display/title/quote (quote is italic); Inter for body/label/caption
(label is Medium weight, uppercase, +1.1px tracking). Loaded via
`expo-font`; the app gates rendering on font load rather than falling
back silently to a system font.

### Spacing & Radius
Strict 8-point grid: `xs 4, sm 8, md 16, lg 24, xl 32, xxl 48, xxxl 64`.
Radius scale: `sm 14, md 18, lg 24, xl 32, pill 999`.

### Elevation (3 tiers)
- `soft` (e1) — resting cards, list rows.
- `lifted` (e2) — the single primary Today card, modals.
- `hero` (e3) — reserved exclusively for the Session Completion arrival
  card. The only surface allowed to feel "above" everything else, and
  only momentarily.

### Motion
Durations: `fast 150ms` (press feedback), `base 200ms` (step
transitions), `slow 250ms` (arrival moments). Easing:
`settle cubic-bezier(.4,0,.2,1)`, `arrive cubic-bezier(.16,1,.3,1)`. Five
named, semantically distinct signature patterns (components in
`src/components/`):
- **Step Settle** (`StepFade.tsx`) — opacity + translateY, keyed to a
  step change. Used in onboarding/session-flow steps.
- **Press Yield** (`usePressScale` in `src/utils/motion.ts`) — scale
  1→0.97 on press, shared by buttons/chips/cards.
- **Arrival Mark** (`ArrivalMark.tsx`) — scale 0.85→1 + fade, reserved
  exclusively for session completion. No bounce, no overshoot, never
  reused for any other moment.
- **Quiet Reveal** (`QuietReveal.tsx`) — opacity + translateY, mount-once
  (not keyed). Used for Home's conditional cards.
- **Page Turn** (`PageTurn.tsx`) — opacity + translateX, mount-once.
  Reserved for Journal entries and Archived Journey rows appearing —
  deliberately distinct from Arrival Mark so "you completed a session"
  and "you saved a reflection" stay two different emotional beats.

**Never:** bounce/spring overshoot, confetti or particles, skeleton
shimmer (use calm fade instead), haptics anywhere but the final
completion moment.

### Accessibility
`useReducedMotion()` (`src/utils/motion.ts`, wraps
`AccessibilityInfo.isReduceMotionEnabled`) is checked by every one of the
five motion patterns above — reduced motion gets opacity-only, halved
duration, never fully instant. Touch targets: `PrimaryButton` 56pt,
`SelectChip` 44pt, close buttons 44×44pt.

### Voice / copy conventions
Three distinct typographic voices, never mixed: italic serif = the app
speaking (mentor voice); roman/bordered = the user's own words; left-rule
serif = scripture (faith-on only). Copy is always specific and human,
never generic ("That didn't save. Your words are still here — try
again?" rather than a generic error).

### Component inventory (`src/components/`)
`ArrivalMark`, `FlowLayout`, `InlineNotice`, `OnboardingLayout`,
`PageTurn`, `PrimaryButton`, `ProgressDots`, `QuietReveal`,
`ScreenContainer`, `SelectChip`, `SelectionCard`, `SessionCompleteScreen`,
`SessionPickerSheet`, `StepFade`.

## What has been decided

- Elevation has exactly 3 tiers, each with one specific, named purpose —
  not a general-purpose shadow scale to reach for freely.
- The five motion patterns are named and kept semantically distinct on
  purpose, even though their underlying code is structurally similar
  (see `docs/engineering/TECH_DEBT.md` M1) — do not casually merge or
  rename them without checking whether their distinct meaning still
  matters to a live design spec.
- `ProgressDots` — dots only, never a percentage or progress bar,
  confirmed correct and unchanged since Sprint 1.

## What is deferred

- A shared `Card` component (surface + radius.lg + padding.xl +
  elevation.soft, currently hand-rolled per-screen) has been flagged as
  a future consolidation candidate since the original Sprint 1 design
  audit — not urgent, but noted so it isn't rebuilt as if new. See
  `docs/engineering/ROADMAP.md`.
- Design work for Splash, Authentication, Premium/Subscription, standalone
  Settings, and standalone Notification Preferences has not begun (see
  `docs/product/PRODUCT_STATE.md`).

## What a future AI session should know

- `src/theme/theme.ts` is the single source of truth for every token in
  this list — never hand-pick a color/spacing/radius/duration value that
  duplicates an existing token (the Sprint 3 architecture review caught
  exactly this mistake once and fixed it — see
  `docs/engineering/HANDOFFS/Sprint-3.md`).
- Before adding a new animation, check whether it's really a new
  signature moment (get explicit design sign-off, like Page Turn had) or
  actually a use of an existing one.
- This document describes what's built, not a design brief. If a future
  design package updates any of the above, update this file to match,
  but don't infer values here as if they were newly decided — cross-
  check `docs/company/DECISION_LOG.md` for when/why a token changed.
