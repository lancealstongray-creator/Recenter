# Recenter — Technical Debt Register

Tracks known debt across the whole repository, not just Sprint 3. Update
this whenever debt is introduced, resolved, or its risk level changes.
Each item states what it is, why it was deferred rather than fixed
immediately, and a recommended approach for whoever picks it up.

---

## High

None currently open. (No item in the repository today is assessed as
high risk — i.e., actively threatening data integrity, a shipped QA rule,
or app stability.)

---

## Medium

### M1. Animation primitive duplication

**Description:** `ArrivalMark`, `QuietReveal`, `StepFade`, and `PageTurn`
(all in `src/components/`) share near-identical structure: two
`useRef(new Animated.Value(...))` values, a `useEffect` that branches on
`useReducedMotion()` and runs `Animated.parallel([...])`, and a thin
`Animated.View` wrapper. Only the animated property (scale vs.
translateY vs. translateX), trigger (mount-once vs. keyed re-trigger),
and duration/easing differ.

**Reason deferred:** Each component is a deliberately named, distinct
"signature moment" per the design system (Arrival Mark = session
completion only; Quiet Reveal = a new state arriving; Step Settle = a
step transition; Page Turn = a reflection/memory moment) — the design
package is explicit that these must stay semantically separate,
including a stated rationale for why Page Turn should *not* reuse Arrival
Mark. Collapsing the code during a pre-merge review pass would have
touched every screen that uses these primitives at once, carrying real
risk of a subtle timing regression with no product spec asking for the
refactor. Deferred rather than rushed.

**Recommended future approach:** Extract a single internal hook, e.g.
`useAxisReveal({ axis: 'x' | 'y' | 'scale', trigger: 'mount' | key,
distance, duration, easing })`, and have each of the four components
become a thin, still-separately-named wrapper around it. This preserves
every component's distinct name and semantic meaning (nothing about the
public API or usage sites changes) while removing the duplicated
boilerplate. Do this as its own isolated PR with before/after visual
verification on every screen that uses any of the four, not bundled with
unrelated feature work.

---

### M2. Season labels don't disambiguate across years

**Description:** `formatSeasonLabel()` (`src/utils/date.ts`) intentionally
never includes a year, matching the design system's literal examples
("Early Summer," "Winter"). Once an installation has more than ~12
months of history, Archived Journey would show two section headers with
the identical label (e.g., two "Summer" sections) for two different
years, with no visual cue distinguishing them.

**Reason deferred:** The approved design spec's examples are explicit
about omitting the year, and the app has no real users yet with more
than a few months of data — this is a real edge case, but not an
active one, and inventing a year-disambiguation scheme wasn't asked for
by the spec.

**Recommended future approach:** When this becomes a real scenario
(confirmed via QA-ARCHIVE-01 during a future regression pass, or via
product feedback), the likely fix is either (a) append the year only
when a season label would otherwise repeat within the visible list, or
(b) get explicit design sign-off to always show the year. Either is a
small, isolated change to `formatSeasonLabel()` and `HistoryScreen.tsx`'s
grouping key.

---

### M3. Archived Journey doesn't surface Midday Reset / Wind Down entries

**Description:** `HistoryScreen.tsx` only reads `dailyEntries` and
`eveningEntries` when building its rows and life-area excerpts. Completed
Midday Reset and Wind Down sessions are invisible there, even though
Journal's feed does include them.

**Reason deferred:** This predates Sprint 3 — it was already flagged as
a known gap in the Today Experience (Sprint 2) handoff, and reframing
Archived Journey's presentation (season grouping, perspective line,
excerpts) was the explicit Sprint 3 scope, not extending its data
sources. Fixing it now would have been scope creep against "evolve, not
rebuild."

**Recommended future approach:** Extend `HistoryScreen.tsx`'s `DayRow`
interface to optionally include `midday`/`windDown` entries, following
the exact pattern already used for `daily`/`evening`. Low complexity,
should be a small, self-contained PR.

---

## Low

### L1. Two harmless ESLint warnings

**Description:**
- `jest.setup.ts:4` — `A require() style import is forbidden`
  (`@typescript-eslint/no-require-imports`). This `require()` is
  necessary: `@react-native-async-storage/async-storage`'s official jest
  mock is only reachable via its package `exports` map's `"./jest"`
  entry, which does not support ESM `import` syntax cleanly in this
  setup file.
- `src/screens/home/HomeScreen.tsx:49` — `useMemo` has an "unnecessary"
  dependency on `date` (react-hooks/exhaustive-deps). `date` is used as
  a deliberate cache-busting key so `now` recomputes when the calendar
  day rolls over, even though the linter can't see that `new Date()`
  itself doesn't read `date`.

**Reason deferred:** Both are intentional, not bugs. Suppressing them
inline would hide genuinely useful lint signal for future changes to
these files; leaving them as visible warnings (not errors) was judged
the more honest option.

**Recommended future approach:** No action needed. If either ever
becomes noisy (e.g., more `useMemo`s in `HomeScreen.tsx` trigger the same
warning), consider a scoped, well-commented inline disable at that
point — not a blanket rule change.

### L2. `react/no-unescaped-entities` and two React Compiler rules are
disabled repository-wide

**Description:** `eslint.config.js` sets `react-hooks/refs`,
`react-hooks/set-state-in-effect`, and `react/no-unescaped-entities` to
`'off'` rather than leaving `eslint-config-expo`'s defaults.

**Reason deferred:** Not deferred — this was a deliberate calibration
decision made when ESLint was first introduced in Sprint 3, not
avoidance of real findings:
- The two React Compiler rules flagged the `useRef(...).current`-at-call
  pattern used consistently and correctly across every animation hook in
  the app (`usePressScale`, `ArrivalMark`, `QuietReveal`, `StepFade`,
  `PageTurn`) and an intentional effect-driven `setState` in
  `useIsOffline`. None of these are bugs.
- `react/no-unescaped-entities` exists for HTML-context JSX; React
  Native's `<Text>` is not parsed as HTML, so escaping apostrophes in
  plain-English copy (of which this app has a great deal) adds no safety
  and actively harms source readability.

**Recommended future approach:** Revisit only if the codebase migrates to
a context where these rules would catch something real (e.g., a future
React DOM/web-specific surface that does render raw HTML). Until then,
no action needed — this is documented calibration, not suppressed
findings.

### L3. `assets/splash-icon.png` (resolved during Sprint 3 review)

**Description:** An unreferenced Expo scaffold asset, never wired into
`app.json`'s splash config (the app uses a custom `LoadingMark` component
instead of the native splash API).

**Status:** Fixed. Removed during the Sprint 3 pre-merge architecture
review (see `HANDOFFS/Sprint-3.md`). Listed here only for the historical
record — no action remains.

### L4. Pre-existing peer dependencies with no direct `src/` import

**Description:** `react-native-gesture-handler`, `react-native-screens`,
and `@expo/metro-runtime` show no direct import anywhere in `src/`.

**Reason deferred:** These are peer dependencies of React Navigation
(gesture-handler/screens enable native stack/tab gesture and rendering
behavior) and Expo's web tooling (`metro-runtime`) respectively — removing
them would very likely break navigation transitions or the web build
even though no app code imports them directly. This predates Sprint 3
entirely (present since Phase 1).

**Recommended future approach:** No action needed unless a future
dependency audit tool (e.g., `depcheck`) is run with awareness of
framework peer-dependency patterns, and even then, verify via a full
manual rebuild + navigation smoke test before removing anything here.
