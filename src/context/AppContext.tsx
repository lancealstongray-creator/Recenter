import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_PROFILE,
  clearAllData,
  loadDailyEntries,
  loadEveningEntries,
  loadMiddayEntries,
  loadProfile,
  loadWindDownEntries,
  saveDailyEntry as persistDailyEntry,
  saveEveningEntry as persistEveningEntry,
  saveMiddayEntry as persistMiddayEntry,
  saveProfile as persistProfile,
  saveWindDownEntry as persistWindDownEntry,
} from '../storage/storage';
import {
  DailyRecenterEntry,
  EveningReflectionEntry,
  MiddayResetEntry,
  UserProfile,
  WindDownEntry,
} from '../types';

interface AppContextValue {
  isLoading: boolean;
  profile: UserProfile;
  dailyEntries: Record<string, DailyRecenterEntry>;
  eveningEntries: Record<string, EveningReflectionEntry>;
  middayEntries: Record<string, MiddayResetEntry>;
  windDownEntries: Record<string, WindDownEntry>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (profile: Partial<UserProfile>) => Promise<void>;
  saveDailyEntry: (entry: DailyRecenterEntry) => Promise<void>;
  saveEveningEntry: (entry: EveningReflectionEntry) => Promise<void>;
  saveMiddayEntry: (entry: MiddayResetEntry) => Promise<void>;
  saveWindDownEntry: (entry: WindDownEntry) => Promise<void>;
  // Marks (or unmarks) today's One Focus complete — purely informational,
  // leaving it active carries no penalty or indicator either way.
  setFocusCompleted: (date: string, completed: boolean) => Promise<void>;
  resetAllData: () => Promise<void>;
  errorMessage: string | null;
  clearErrorMessage: () => void;
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
  const [middayEntries, setMiddayEntries] = useState<Record<string, MiddayResetEntry>>({});
  const [windDownEntries, setWindDownEntries] = useState<Record<string, WindDownEntry>>({});
  const [justOnboarded, setJustOnboarded] = useState(false);
  const [pendingFirstFocus, setPendingFirstFocus] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearErrorMessage = useCallback(() => setErrorMessage(null), []);

  useEffect(() => {
    (async () => {
      const [p, d, e, m, w] = await Promise.all([
        loadProfile(),
        loadDailyEntries(),
        loadEveningEntries(),
        loadMiddayEntries(),
        loadWindDownEntries(),
      ]);
      setProfile(p.ok ? p.data : DEFAULT_PROFILE);
      setDailyEntries(d.ok ? d.data : {});
      setEveningEntries(e.ok ? e.data : {});
      setMiddayEntries(m.ok ? m.data : {});
      setWindDownEntries(w.ok ? w.data : {});
      if (!p.ok || !d.ok || !e.ok || !m.ok || !w.ok) {
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

  const saveMiddayEntry = useCallback(async (entry: MiddayResetEntry) => {
    const result = await persistMiddayEntry(entry);
    if (result.ok) {
      setMiddayEntries(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error);
    }
  }, []);

  const saveWindDownEntry = useCallback(async (entry: WindDownEntry) => {
    const result = await persistWindDownEntry(entry);
    if (result.ok) {
      setWindDownEntries(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error);
    }
  }, []);

  const setFocusCompleted = useCallback(
    async (date: string, completed: boolean) => {
      const existing = dailyEntries[date];
      if (!existing) return;
      await saveDailyEntry({ ...existing, focusCompleted: completed });
    },
    [dailyEntries, saveDailyEntry]
  );

  const resetAllData = useCallback(async () => {
    const result = await clearAllData();
    if (result.ok) {
      setProfile(DEFAULT_PROFILE);
      setDailyEntries({});
      setEveningEntries({});
      setMiddayEntries({});
      setWindDownEntries({});
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
      middayEntries,
      windDownEntries,
      updateProfile,
      completeOnboarding,
      saveDailyEntry,
      saveEveningEntry,
      saveMiddayEntry,
      saveWindDownEntry,
      setFocusCompleted,
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
      middayEntries,
      windDownEntries,
      updateProfile,
      completeOnboarding,
      saveDailyEntry,
      saveEveningEntry,
      saveMiddayEntry,
      saveWindDownEntry,
      setFocusCompleted,
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
