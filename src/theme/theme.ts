// Calm, premium, minimal palette. Warm neutrals with a single muted sage
// accent — deliberately quiet so nothing competes for attention.
export const colors = {
  background: '#FAF8F4',
  // Evening Reflection only: a shade warmer/dimmer so the evening moment
  // reads distinct from morning without any layout change.
  backgroundEvening: '#F5F1EA',
  surface: '#FFFFFF',
  surfaceMuted: '#F2EFE9',
  border: '#E7E2D9',
  // Input focus state only.
  borderStrong: '#D8D1C4',
  textPrimary: '#2B2A26',
  textSecondary: '#6F6A61',
  // #8A8377 (was #A39D91) — the original measured ~2.3:1 on background,
  // failing WCAG AA for the 13px label/caption text it's used on
  // everywhere. This restores ~3.1:1 while staying the quietest tone.
  textTertiary: '#8A8377',
  accent: '#6E8B6E',
  accentDark: '#516750',
  accentSoft: '#E4EAE1',
  error: '#B3564B',
  errorSoft: '#F3E4E1',
  white: '#FFFFFF',
};

// Strict 8-point grid. xs is the one accepted half-step, used only for
// hairline gaps (icon-to-label, dot spacing) — everything else is a
// multiple of 8.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radii = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
};

const serif = 'InstrumentSerif_400Regular';
const serifItalic = 'InstrumentSerif_400Regular_Italic';
const sans = 'Inter_400Regular';
const sansMedium = 'Inter_500Medium';

// A deliberately shallow hierarchy: one hero size, one title, one body,
// one supporting label. Nothing competes with the greeting or the day's
// single focus for attention.
export const typography = {
  hero: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  display: {
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  title: {
    fontFamily: serif,
    fontSize: 21,
    lineHeight: 28,
    letterSpacing: 0.1,
    color: colors.textPrimary,
  },
  quote: {
    fontFamily: serifItalic,
    fontStyle: 'italic' as const,
    fontSize: 18,
    lineHeight: 27,
    color: colors.textSecondary,
  },
  body: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 25,
    color: colors.textPrimary,
  },
  bodyMuted: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 25,
    color: colors.textSecondary,
  },
  label: {
    fontFamily: sansMedium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.1,
    color: colors.textTertiary,
  },
  caption: {
    fontFamily: sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textTertiary,
  },
};

// Two tiers only. e1 for anything at rest (cards, rows, chips). e2 for a
// deliberate lift — modal sheets, the Tour, a completion mark. Never
// beyond e2: nothing here reaches for drama.
export const elevation = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 1,
  },
  lifted: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
  },
};

// Transitions are felt, not seen: short fades/settles between steps,
// nothing decorative or bouncy.
export const motion = {
  duration: {
    fast: 150,
    base: 200,
    slow: 250,
  },
  // Cubic-bezier control points for use with Easing.bezier(...).
  easing: {
    settle: [0.4, 0, 0.2, 1] as const,
    arrive: [0.16, 1, 0.3, 1] as const,
  },
};
