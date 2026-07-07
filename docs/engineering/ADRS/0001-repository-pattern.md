# ADR-0001: Strict repository pattern for all persistence

**Status:** Accepted (established Phase 1, verified/re-confirmed during
the Sprint 3 architecture review)

## Context

Recenter is fully local-first: no backend, no network dependency for any
feature. All data (profile, session entries, Journal entries) persists
via `@react-native-async-storage/async-storage`. Screens need to read
and write this data throughout the app.

## Decision

Enforce a strict, one-directional layering with no exceptions:

```
Screen  →  AppContext (React Context)  →  storage.ts (repository)  →  AsyncStorage
```

- No screen ever imports `AsyncStorage` directly.
- No screen ever imports `storage.ts` directly.
- `AppContext` is the *only* caller of `storage.ts`'s functions, and the
  *only* place component state is derived from storage reads.
- Every `storage.ts` function returns a typed
  `StorageResult<T> = {ok:true,data:T} | {ok:false,error:string}`
  instead of throwing — failures are data, not exceptions, and
  `AppContext` surfaces them via a shared `errorMessage` field.

## Consequences

- Adding a new data type (e.g. Journal entries in Sprint 3) always means:
  a new type in `types/index.ts`, load/save functions in `storage.ts`,
  state + an action in `AppContext.tsx` — never a shortcut of a screen
  reading `AsyncStorage` directly, no matter how small the feature.
- This boundary is cheap to verify mechanically: `grep -rn "AsyncStorage"
  src/screens` should always return nothing. This check is part of the
  Sprint 3 architecture review and should be repeated at the close of
  every future sprint that touches data flow.
- No additional global state library (Redux, Zustand, MobX) has been
  needed or introduced — a single Context has been sufficient through
  Sprint 3. If a future sprint considers adding one, that should be its
  own ADR, not a quiet dependency addition.
