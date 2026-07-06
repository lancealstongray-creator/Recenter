import { FEATURE_FLAGS } from './featureFlags';

// Regression guard: Phase 1 must ship with every Phase 2/3 flag off. If
// this fails, a deferred feature was flipped on without an explicit
// product decision to bring it into scope.
describe('FEATURE_FLAGS', () => {
  it('every phase2 flag is false', () => {
    Object.entries(FEATURE_FLAGS.phase2).forEach(([key, value]) => {
      expect({ key, value }).toEqual({ key, value: false });
    });
  });

  it('every phase3 flag is false', () => {
    Object.entries(FEATURE_FLAGS.phase3).forEach(([key, value]) => {
      expect({ key, value }).toEqual({ key, value: false });
    });
  });
});
