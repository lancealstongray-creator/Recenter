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
};

export async function loadProfile(): Promise<UserProfile> {
  const raw = await AsyncStorage.getItem(KEYS.profile);
  if (!raw) return DEFAULT_PROFILE;
  return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export async function loadDailyEntries(): Promise<Record<string, DailyRecenterEntry>> {
  const raw = await AsyncStorage.getItem(KEYS.dailyEntries);
  return raw ? JSON.parse(raw) : {};
}

export async function saveDailyEntry(entry: DailyRecenterEntry): Promise<Record<string, DailyRecenterEntry>> {
  const all = await loadDailyEntries();
  const next = { ...all, [entry.date]: entry };
  await AsyncStorage.setItem(KEYS.dailyEntries, JSON.stringify(next));
  return next;
}

export async function loadEveningEntries(): Promise<Record<string, EveningReflectionEntry>> {
  const raw = await AsyncStorage.getItem(KEYS.eveningEntries);
  return raw ? JSON.parse(raw) : {};
}

export async function saveEveningEntry(
  entry: EveningReflectionEntry
): Promise<Record<string, EveningReflectionEntry>> {
  const all = await loadEveningEntries();
  const next = { ...all, [entry.date]: entry };
  await AsyncStorage.setItem(KEYS.eveningEntries, JSON.stringify(next));
  return next;
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.removeMany([KEYS.profile, KEYS.dailyEntries, KEYS.eveningEntries]);
}
