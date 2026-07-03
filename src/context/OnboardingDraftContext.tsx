import React, { createContext, useContext, useMemo, useState } from 'react';

interface OnboardingDraft {
  lifeAreaIds: string[];
  name: string;
}

interface OnboardingDraftContextValue {
  draft: OnboardingDraft;
  setLifeAreaIds: (ids: string[]) => void;
  setName: (name: string) => void;
}

const OnboardingDraftContext = createContext<OnboardingDraftContextValue | undefined>(undefined);

export function OnboardingDraftProvider({ children }: { children: React.ReactNode }) {
  const [lifeAreaIds, setLifeAreaIds] = useState<string[]>([]);
  const [name, setName] = useState('');

  const value = useMemo(
    () => ({ draft: { lifeAreaIds, name }, setLifeAreaIds, setName }),
    [lifeAreaIds, name]
  );

  return <OnboardingDraftContext.Provider value={value}>{children}</OnboardingDraftContext.Provider>;
}

export function useOnboardingDraft(): OnboardingDraftContextValue {
  const ctx = useContext(OnboardingDraftContext);
  if (!ctx) throw new Error('useOnboardingDraft must be used within OnboardingDraftProvider');
  return ctx;
}
