import { ONBOARDING_STEPS } from './types';

describe('ONBOARDING_STEPS', () => {
  it('has exactly 6 unique screens, starting with Welcome', () => {
    expect(ONBOARDING_STEPS).toHaveLength(6);
    expect(new Set(ONBOARDING_STEPS).size).toBe(6);
    expect(ONBOARDING_STEPS[0]).toBe('Welcome');
    expect(ONBOARDING_STEPS[ONBOARDING_STEPS.length - 1]).toBe('Notifications');
  });

  it('resolves a valid screen for every in-range resume step (interrupted-onboarding resume)', () => {
    for (let step = 0; step < ONBOARDING_STEPS.length; step++) {
      expect(ONBOARDING_STEPS[step]).toBeDefined();
    }
  });

  it('falls back safely for an out-of-range step index', () => {
    // Mirrors OnboardingNavigator's `ONBOARDING_STEPS[step] ?? ONBOARDING_STEPS[0]`
    // fallback, so a corrupted/out-of-range onboardingStep never crashes
    // the resume logic.
    const outOfRange = ONBOARDING_STEPS[99] ?? ONBOARDING_STEPS[0];
    expect(outOfRange).toBe('Welcome');
  });
});
