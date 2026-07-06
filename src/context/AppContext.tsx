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
  // Set whenever a save to local storage fails, so a screen can choose
  // to surface it inline (error/errorSoft tokens) instead of failing
  // silently. Cleared automatically on the next successful save.
  errorMessage: string | null;
  clearErrorMessage: () => void;
  // Transient (not persisted) hand-off from onboarding into the user's
  // real first Morning Session — never a simulated tutorial.
  justOnboarded: boolean;
  pendingFirstFocus: string;
  clearJustOnboarded: () => void;
  clearPendingFirstFocus: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [dailyEntries, setDailyEntries] = useState<Record<string, DailyRecenterEntry>>({});
  const [eveningEntries, setEveningEntries] = useState<Record<string, EveningReflectionEntry>>({});
  const [justOnboarded, setJustOnboarded] = useState(false);
  const [pendingFirstFocus, setPendingFirstFocus] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearErrorMessage = useCallback(() => setErrorMessage(null), []);

  useEffect(() => {
    (async () => {
      const [p, d, e] = await Promise.all([loadProfile(), loadDailyEntries(), loadEveningEntries()]);
      setProfile(p.ok ? p.data : DEFAULT_PROFILE);
      setDailyEntries(d.ok ? d.data : {});
      setEveningEntries(e.ok ? e.data : {});
      if (!p.ok || !d.ok || !e.ok) {
        setErrorMessage('We had trouble loading your data. Starting fresh for now.');
      }
      setIsLoading(false);
    })();
  }, []);

  const updateProfile = useCallback(
    async (partial: Partial<UserProfile>) => {
      const next = { ...profile, ...partial };
      setProfile(next);
      const result = await persistProfile(next);
      setErrorMessage(result.ok ? null : result.error);
    },
    [profile]
  );

  const completeOnboarding = useCallback(
    async (partial: Partial<UserProfile>) => {
      const next = { ...profile, ...partial, onboardingComplete: true, draftFocus: '' };
      setProfile(next);
      const result = await persistProfile(next);
      setErrorMessage(result.ok ? null : result.error);
      setPendingFirstFocus(partial.draftFocus ?? profile.draftFocus ?? '');
      setJustOnboarded(true);
    },
    [profile]
  );

  const clearJustOnboarded = useCallback(() => {
    setJustOnboarded(false);
  }, []);

  const clearPendingFirstFocus = useCallback(() => {
    setPendingFirstFocus('');
  }, []);

  const saveDailyEntry = useCallback(async (entry: DailyRecenterEntry) => {
    const result = await persistDailyEntry(entry);
    if (result.ok) {
      setDailyEntries(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error);
    }
  }, []);

  const saveEveningEntry = useCallback(async (entry: EveningReflectionEntry) => {
    const result = await persistEveningEntry(entry);
    if (result.ok) {
      setEveningEntries(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error);
    }
  }, []);

  const resetAllData = useCallback(async () => {
    const result = await clearAllData();
    if (result.ok) {
      setProfile(DEFAULT_PROFILE);
      setDailyEntries({});
      setEveningEntries({});
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error);
    }
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
      errorMessage,
      clearErrorMessage,
      justOnboarded,
      pendingFirstFocus,
      clearJustOnboarded,
      clearPendingFirstFocus,
    }),
    [
      isLoading,
      profile,
      dailyEntries,
      eveningEntries,
      updateProfile,
      completeOnboarding,
      saveDailyEntry,
      saveEveningEntry,
      resetAllData,
      errorMessage,
      clearErrorMessage,
      justOnboarded,
      pendingFirstFocus,
      clearJustOnboarded,
      clearPendingFirstFocus,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
