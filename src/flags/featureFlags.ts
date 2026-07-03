/**
 * Phase 1 ships with these OFF. They exist so future phases have a named
 * switch to flip rather than a UI to bolt on. Nothing below is rendered,
 * routed to, or referenced by any Phase 1 screen.
 */
export const FEATURE_FLAGS = {
  phase2: {
    streaksAndConsistencyScores: false,
    badgesAndGamification: false,
    socialSharing: false,
    customLifeAreas: false,
    multipleDailyFocuses: false,
    reminderNotifications: false,
    insightsDashboard: false,
  },
  phase3: {
    coachOrTherapistSharing: false,
    aiReflectionSummaries: false,
    communityFeatures: false,
    exportAndIntegrations: false,
  },
} as const;

export type FeatureFlags = typeof FEATURE_FLAGS;
