# Test fixtures

Sample data for the three AsyncStorage keys the app uses:
`@recenter/profile`, `@recenter/dailyEntries`, `@recenter/eveningEntries`.

## Loading a fixture manually (web)

1. `npm run web`, open the app once so `localStorage` exists for the origin.
2. Browser devtools → Console, run:
   ```js
   localStorage.setItem('@recenter/profile', JSON.stringify(/* paste profile-*.json contents */));
   localStorage.setItem('@recenter/dailyEntries', JSON.stringify(/* paste daily-entries.json contents */));
   localStorage.setItem('@recenter/eveningEntries', JSON.stringify(/* paste evening-entries.json contents */));
   ```
3. Reload the page.

## Using a fixture in a Jest test

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import profileFixture from '../../qa/test-data/profile-onboarded.json';

await AsyncStorage.setItem('@recenter/profile', JSON.stringify(profileFixture));
```

## Files

- `profile-fresh-install.json` — default profile, onboarding not started.
- `profile-mid-onboarding.json` — interrupted partway through (Faith
  Preference), for resume testing (QA-ONB-07).
- `profile-onboarded.json` — fully onboarded, tour already seen.
- `daily-entries.json` — Daily Recenter history on 2026-06-20, 06-21,
  06-22, then a deliberate 9-day gap, then 2026-07-02 and 2026-07-06 —
  for QA-ABS-01/02/03 missed-day testing (Journey should show only the
  5 real dates, no gap indicator of any kind).
- `evening-entries.json` — Evening Reflection entries only on 2026-06-20,
  06-21, and 07-06 — deliberately missing on 06-22 and 07-02 so you can
  confirm a day with only a morning session (no evening entry) renders
  correctly on both Home and Journey.
