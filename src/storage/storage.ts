import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyRecenterEntry, EveningReflectionEntry, UserProfile } from '../types';

const KEYS = {
  profile: '@recenter/profile',
  dailyEntries: '@recenter/dailyEntries',
  eveningEntries: '@recenter/eveningEntries',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  lifeAreaIds: [],
  onboardingComplete: false,
  onboardingStep: 0,
  faithPreference: null,
  notificationsEnabled: false,
  draftFocus: '',
  hasSeenTour: false,
};

export type StorageResult<T> = { ok: true; data: T } | { ok: false; error: string };

function failure(err: unknown): { ok: false; error: string } {
  return { ok: false, error: err instanceof Error ? err.message : 'Something went wrong saving that.' };
}

export async function loadProfile(): Promise<StorageResult<UserProfile>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.profile);
    const data = raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
    return { ok: true, data };
  } catch (err) {
    return failure(err);
  }
}

export async function saveProfile(profile: UserProfile): Promise<StorageResult<UserProfile>> {
  try {
    await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
    return { ok: true, data: profile };
  } catch (err) {
    return failure(err);
  }
}

export async function loadDailyEntries(): Promise<StorageResult<Record<string, DailyRecenterEntry>>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.dailyEntries);
    return { ok: true, data: raw ? JSON.parse(raw) : {} };
  } catch (err) {
    return failure(err);
  }
}

export async function saveDailyEntry(
  entry: DailyRecenterEntry
): Promise<StorageResult<Record<string, DailyRecenterEntry>>> {
  try {
    const existing = await loadDailyEntries();
    const all = existing.ok ? existing.data : {};
    const next = { ...all, [entry.date]: entry };
    await AsyncStorage.setItem(KEYS.dailyEntries, JSON.stringify(next));
    return { ok: true, data: next };
  } catch (err) {
    return failure(err);
  }
}

export async function loadEveningEntries(): Promise<StorageResult<Record<string, EveningReflectionEntry>>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.eveningEntries);
    return { ok: true, data: raw ? JSON.parse(raw) : {} };
  } catch (err) {
    return failure(err);
  }
}

export async function saveEveningEntry(
  entry: EveningReflectionEntry
): Promise<StorageResult<Record<string, EveningReflectionEntry>>> {
  try {
    const existing = await loadEveningEntries();
    const all = existing.ok ? existing.data : {};
    const next = { ...all, [entry.date]: entry };
    await AsyncStorage.setItem(KEYS.eveningEntries, JSON.stringify(next));
    return { ok: true, data: next };
  } catch (err) {
    return failure(err);
  }
}

export async function clearAllData(): Promise<StorageResult<null>> {
  try {
    await AsyncStorage.removeMany([KEYS.profile, KEYS.dailyEntries, KEYS.eveningEntries]);
    return { ok: true, data: null };
  } catch (err) {
    return failure(err);
  }
}
