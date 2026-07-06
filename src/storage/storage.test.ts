import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_PROFILE,
  clearAllData,
  loadDailyEntries,
  loadEveningEntries,
  loadProfile,
  saveDailyEntry,
  saveEveningEntry,
  saveProfile,
} from './storage';
import { DailyRecenterEntry, EveningReflectionEntry } from '../types';

const dailyEntry = (overrides: Partial<DailyRecenterEntry> = {}): DailyRecenterEntry => ({
  date: '2026-07-06',
  moodId: 'calm',
  lifeAreaId: 'health',
  focus: 'Take a short walk',
  completedAt: '2026-07-06T08:00:00.000Z',
  ...overrides,
});

const eveningEntry = (overrides: Partial<EveningReflectionEntry> = {}): EveningReflectionEntry => ({
  date: '2026-07-06',
  highlight: 'A good walk',
  challenge: 'Too many meetings',
  gratitude: 'My family',
  completedAt: '2026-07-06T21:00:00.000Z',
  ...overrides,
});

afterEach(async () => {
  await AsyncStorage.clear();
});

describe('loadProfile / saveProfile', () => {
  it('returns the default profile when nothing has been saved', async () => {
    const result = await loadProfile();
    expect(result).toEqual({ ok: true, data: DEFAULT_PROFILE });
  });

  it('round-trips a saved profile', async () => {
    const profile = { ...DEFAULT_PROFILE, name: 'Lance', onboardingComplete: true };
    await saveProfile(profile);
    const result = await loadProfile();
    expect(result).toEqual({ ok: true, data: profile });
  });

  it('merges a partial stored profile onto current defaults (forward-compatible with new fields)', async () => {
    await AsyncStorage.setItem('@recenter/profile', JSON.stringify({ name: 'Lance' }));
    const result = await loadProfile();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ ...DEFAULT_PROFILE, name: 'Lance' });
    }
  });
});

describe('saveDailyEntry — no duplicate completions', () => {
  it('a single save results in exactly one entry for that date', async () => {
    await saveDailyEntry(dailyEntry());
    const result = await loadDailyEntries();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.data)).toEqual(['2026-07-06']);
    }
  });

  it('saving twice for the same date overwrites rather than duplicating', async () => {
    await saveDailyEntry(dailyEntry({ focus: 'First focus' }));
    await saveDailyEntry(dailyEntry({ focus: 'Second focus' }));
    const result = await loadDailyEntries();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.data)).toHaveLength(1);
      expect(result.data['2026-07-06'].focus).toBe('Second focus');
    }
  });

  it('entries for different dates do not clobber each other', async () => {
    await saveDailyEntry(dailyEntry({ date: '2026-07-05', focus: 'Yesterday' }));
    await saveDailyEntry(dailyEntry({ date: '2026-07-06', focus: 'Today' }));
    const result = await loadDailyEntries();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.data).sort()).toEqual(['2026-07-05', '2026-07-06']);
      expect(result.data['2026-07-05'].focus).toBe('Yesterday');
      expect(result.data['2026-07-06'].focus).toBe('Today');
    }
  });
});

describe('saveEveningEntry — no duplicate completions, no data loss', () => {
  it('preserves an unrelated date while updating another', async () => {
    await saveEveningEntry(eveningEntry({ date: '2026-07-05', highlight: 'Yesterday walk' }));
    await saveEveningEntry(eveningEntry({ date: '2026-07-06', highlight: 'Today walk' }));
    const result = await loadEveningEntries();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data['2026-07-05'].highlight).toBe('Yesterday walk');
      expect(result.data['2026-07-06'].highlight).toBe('Today walk');
    }
  });
});

describe('error safety', () => {
  it('loadProfile returns a typed error instead of throwing when storage is corrupt', async () => {
    await AsyncStorage.setItem('@recenter/profile', 'not valid json{{{');
    const result = await loadProfile();
    expect(result.ok).toBe(false);
  });

  it('saveDailyEntry surfaces a typed error if the underlying write rejects', async () => {
    const spy = jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('disk full'));
    const result = await saveDailyEntry(dailyEntry());
    expect(result).toEqual({ ok: false, error: 'disk full' });
    spy.mockRestore();
  });
});

describe('clearAllData', () => {
  it('removes profile, daily entries, and evening entries', async () => {
    await saveProfile({ ...DEFAULT_PROFILE, name: 'Lance' });
    await saveDailyEntry(dailyEntry());
    await saveEveningEntry(eveningEntry());

    await clearAllData();

    const [profile, daily, evening] = await Promise.all([loadProfile(), loadDailyEntries(), loadEveningEntries()]);
    expect(profile).toEqual({ ok: true, data: DEFAULT_PROFILE });
    expect(daily).toEqual({ ok: true, data: {} });
    expect(evening).toEqual({ ok: true, data: {} });
  });
});
