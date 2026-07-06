# Recenter QA — how to test, debug, and verify before committing

This is the local QA foundation for Recenter. It exists so every future
change follows: **Build → Test → Debug → Verify → Commit.**

## The workflow

1. **Build** — make your change.
2. **Test** — `npm test` (automated) covering the scenario you touched.
   If no automated test covers it, work through the relevant section of
   `smoke-checklist.md` by hand.
3. **Debug** — see "Debug workflow" below.
4. **Verify** — `npm run verify` (typecheck + full test suite). For
   anything touching a Critical scenario in `TEST_PLAN.md`, also run
   through `regression-checklist.md`.
5. **Commit** — a pre-commit hook (Husky, `.husky/pre-commit`) runs
   `npm run verify` automatically. A failing verify blocks the commit.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run web` | Run the app in a browser at `http://localhost:8081` (fastest local loop) |
| `npm start` | Run via Expo dev server / QR code for a real device or simulator |
| `npm run typecheck` | `tsc --noEmit` — no compiled output, just type errors |
| `npm test` | Run the full Jest suite once |
| `npm run test:watch` | Jest in watch mode while developing |
| `npm run test:coverage` | Jest with a coverage report |
| `npm run build` | Typecheck, then `expo export --platform web` — the closest thing to a production build check in this environment |
| `npm run verify` | `typecheck` + `test` — the single command CI and the pre-commit hook both run |

## Debug workflow

- **Fastest inner loop:** `npm run web`, then use the browser's own
  devtools (React DevTools works out of the box). Console errors show up
  directly in the terminal running `npm run web` as well as the browser
  console.
- **State inspection:** almost all app state lives in one place —
  `src/context/AppContext.tsx`. If something looks wrong on screen, first
  check `profile`, `dailyEntries`, `eveningEntries` there (log them, or
  inspect via React DevTools' component tree — `AppProvider` is high in
  the tree and its state is visible in the "hooks" panel).
- **Storage inspection (web):** AsyncStorage on web is backed by
  `localStorage`. Open browser devtools → Application → Local Storage →
  `http://localhost:8081`, keys are prefixed `@recenter/`.
- **Resetting local state:** Profile tab → "Reset my data" clears
  everything and returns to onboarding, without needing to clear browser
  storage manually.
- **Isolating a failing test:** `npx jest path/to/file.test.ts -t "test name"`
  runs a single test with full output.
- **A test hangs or leaves dangling state:** check that every
  `renderHook`/`render` call in the test is unmounted (see the `afterEach`
  pattern in `src/context/AppContext.test.tsx`) — the RN Testing Library
  version pinned here (`@testing-library/react-native` v14) has async
  `renderHook`/`act`; forgetting `await` on either is the most common
  cause of a test polluting the ones after it.

## Why full UI/E2E automation isn't in place yet

This is a React Native (Expo) app with no web-only DOM to drive with a
plain browser automation tool in the general case (it needs to also run
on iOS/Android), and no test IDs or accessibility labels wired up
specifically for automation yet. Full navigation + component tests are
possible with `@testing-library/react-native` (already installed) but
require mocking React Navigation's native stack/tab navigators and Expo's
font loading together — a real but larger effort than this stabilization
pass.

What's automated instead is the **data and logic layer** — where the QA
rules in `TEST_PLAN.md` actually live: session dedup, no data loss, resume
behavior, date/time math, and the feature-flag guardrail. This is the
highest-value automation for the risk described in the QA rules (data
loss and duplication are logic-layer bugs, not rendering bugs).

**Recommended next QA milestone:** add `@testing-library/react-native`
screen-level tests for the three highest-risk flows (Daily Recenter,
Evening Reflection, Onboarding resume) once test IDs are added to their
key interactive elements. Until then, `smoke-checklist.md` and
`regression-checklist.md` are the authoritative manual process — run them
by hand (or via `npm run web` + browser) before any release.

## Filing a bug

Use `bug-report-template.md`. Always include the QA ID from
`TEST_PLAN.md` if the bug corresponds to a scenario there.

## Test data

`test-data/` has fixture JSON for the three storage shapes (`profile`,
`dailyEntries`, `eveningEntries`) at a few useful states (fresh install,
mid-onboarding, fully onboarded with history). See `test-data/README.md`
for how to load them.
