import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_PROFILE,
  clearAllData,
  loadDailyEntries,
  loadEveningEntries,
  loadProfile,
  saveDailyEntry as persistDailyEntry,
  saveEveningEntry as persistEveningEntry,
  saveProfile as persistProfile,
} from '../storage/storage';
import { DailyRecenterEntry, EveningReflectionEntry, UserProfile } from '../types';

interface AppContextValue {
  isLoading: boolean;
  profile: UserProfile;
  dailyEntries: Record<string, DailyRecenterEntry>;
  eveningEntries: Record<string, EveningReflectionEntry>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (profile: Partial<UserProfile>) => Promise<void>;
  saveDailyEntry: (entry: DailyRecenterEntry) => Promise<void>;
  saveEveningEntry: (entry: EveningReflectionEntry) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [dailyEntries, setDailyEntries] = useState<Record<string, DailyRecenterEntry>>({});
  const [eveningEntries, setEveningEntries] = useState<Record<string, EveningReflectionEntry>>({});

  useEffect(() => {
    (async () => {
      const [p, d, e] = await Promise.all([loadProfile(), loadDailyEntries(), loadEveningEntries()]);
      setProfile(p);
      setDailyEntries(d);
      setEveningEntries(e);
      setIsLoading(false);
    })();
  }, []);

  const updateProfile = useCallback(
    async (partial: Partial<UserProfile>) => {
      const next = { ...profile, ...partial };
      setProfile(next);
      await persistProfile(next);
    },
    [profile]
  );

  const completeOnboarding = useCallback(
    async (partial: Partial<UserProfile>) => {
      const next = { ...profile, ...partial, onboardingComplete: true };
      setProfile(next);
      await persistProfile(next);
    },
    [profile]
  );

  const saveDailyEntry = useCallback(async (entry: DailyRecenterEntry) => {
    const next = await persistDailyEntry(entry);
    setDailyEntries(next);
  }, []);

  const saveEveningEntry = useCallback(async (entry: EveningReflectionEntry) => {
    const next = await persistEveningEntry(entry);
    setEveningEntries(next);
  }, []);

  const resetAllData = useCallback(async () => {
    await clearAllData();
    setProfile(DEFAULT_PROFILE);
    setDailyEntries({});
    setEveningEntries({});
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      profile,
      dailyEntries,
      eveningEntries,
      updateProfile,
      completeOnboarding,
      saveDailyEntry,
      saveEveningEntry,
      resetAllData,
    }),
    [isLoading, profile, dailyEntries, eveningEntries, updateProfile, completeOnboarding, saveDailyEntry, saveEveningEntry, resetAllData]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
