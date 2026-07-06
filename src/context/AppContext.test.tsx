import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AppProvider, useApp } from './AppContext';
import { DEFAULT_PROFILE } from '../storage/storage';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

let activeUnmount: (() => Promise<void>) | null = null;

async function renderApp() {
  const view = await renderHook(() => useApp(), { wrapper });
  activeUnmount = view.unmount;
  await waitFor(() => expect(view.result.current.isLoading).toBe(false));
  return view;
}

afterEach(async () => {
  if (activeUnmount) {
    await activeUnmount();
    activeUnmount = null;
  }
  await AsyncStorage.clear();
});

describe('AppContext — session completion cannot duplicate', () => {
  it('saving a Daily Recenter entry twice for today keeps exactly one entry', async () => {
    const { result } = await renderApp();

    await act(async () => {
      await result.current.saveDailyEntry({
        date: '2026-07-06',
        moodId: 'calm',
        lifeAreaId: 'health',
        focus: 'First pass',
        completedAt: '2026-07-06T08:00:00.000Z',
      });
    });
    await act(async () => {
      await result.current.saveDailyEntry({
        date: '2026-07-06',
        moodId: 'energized',
        lifeAreaId: 'growth',
        focus: 'Second pass',
        completedAt: '2026-07-06T08:05:00.000Z',
      });
    });

    expect(Object.keys(result.current.dailyEntries)).toEqual(['2026-07-06']);
    expect(result.current.dailyEntries['2026-07-06'].focus).toBe('Second pass');
  });
});

describe('AppContext — reflection/session data is not lost across relaunch', () => {
  it('a saved evening entry survives a fresh provider mount (simulated app relaunch)', async () => {
    const first = await renderApp();
    await act(async () => {
      await first.result.current.saveEveningEntry({
        date: '2026-07-06',
        highlight: 'A good walk',
        challenge: 'Too many meetings',
        gratitude: 'My family',
        completedAt: '2026-07-06T21:00:00.000Z',
      });
    });
    await first.unmount();

    // Simulate the app being closed and reopened: a brand new provider
    // instance reading from the same underlying storage.
    const second = await renderApp();
    expect(second.result.current.eveningEntries['2026-07-06']?.highlight).toBe('A good walk');
  });
});

describe("AppContext — onboarding hand-off into the user's real first session", () => {
  it('completeOnboarding flags justOnboarded and carries the chosen focus forward exactly once', async () => {
    const { result } = await renderApp();

    await act(async () => {
      await result.current.completeOnboarding({
        lifeAreaIds: ['health', 'rest', 'growth'],
        faithPreference: 'no',
        notificationsEnabled: false,
        draftFocus: 'Take a short walk today',
      });
    });

    expect(result.current.profile.onboardingComplete).toBe(true);
    expect(result.current.justOnboarded).toBe(true);
    expect(result.current.pendingFirstFocus).toBe('Take a short walk today');

    // DailyRecenterScreen consumes both flags once, at mount, then clears
    // them — later sessions must not see stale onboarding state.
    await act(async () => {
      result.current.clearJustOnboarded();
      result.current.clearPendingFirstFocus();
    });
    expect(result.current.justOnboarded).toBe(false);
    expect(result.current.pendingFirstFocus).toBe('');
  });

  it('persists onboarding progress after every screen so an interrupted onboarding resumes', async () => {
    const first = await renderApp();
    await act(async () => {
      await first.result.current.updateProfile({ onboardingStep: 3, lifeAreaIds: ['health', 'rest', 'growth'] });
    });
    await first.unmount();

    // Simulate the app being killed mid-onboarding and reopened.
    const second = await renderApp();
    expect(second.result.current.profile.onboardingStep).toBe(3);
    expect(second.result.current.profile.lifeAreaIds).toEqual(['health', 'rest', 'growth']);
    expect(second.result.current.profile.onboardingComplete).toBe(false);
  });
});

describe('AppContext — returning users resume without friction', () => {
  it('starts a fresh session with the default (non-onboarded) profile', async () => {
    const { result } = await renderApp();
    expect(result.current.profile).toEqual(DEFAULT_PROFILE);
    expect(result.current.dailyEntries).toEqual({});
    expect(result.current.eveningEntries).toEqual({});
  });

  it('resetAllData returns the app to a clean first-run state', async () => {
    const { result } = await renderApp();
    await act(async () => {
      await result.current.completeOnboarding({ lifeAreaIds: ['health', 'rest', 'growth'] });
    });
    await act(async () => {
      await result.current.resetAllData();
    });
    expect(result.current.profile).toEqual(DEFAULT_PROFILE);
  });
});
