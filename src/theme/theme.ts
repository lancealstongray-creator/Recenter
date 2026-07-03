import { Platform } from 'react-native';

// Calm, premium, minimal palette. Warm neutrals with a single muted sage
// accent — deliberately quiet so nothing competes for attention.
export const colors = {
  background: '#FAF8F4',
  surface: '#FFFFFF',
  surfaceMuted: '#F2EFE9',
  border: '#E7E2D9',
  textPrimary: '#2B2A26',
  textSecondary: '#6F6A61',
  textTertiary: '#A39D91',
  accent: '#6E8B6E',
  accentDark: '#516750',
  accentSoft: '#E4EAE1',
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
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
};

const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

// A deliberately shallow hierarchy: one hero size, one title, one body,
// one supporting label. Nothing competes with the greeting or the day's
// single focus for attention.
export const typography = {
  hero: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: 0.1,
    color: colors.textPrimary,
  },
  display: {
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0.1,
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
    fontFamily: serif,
    fontStyle: 'italic' as const,
    fontSize: 18,
    lineHeight: 27,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.textPrimary,
  },
  bodyMuted: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.1,
    color: colors.textTertiary,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textTertiary,
  },
};

// Shadows exist only to lift a surface a hair off the background — never
// to add depth or drama.
export const shadow = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 1,
  },
};

// Transitions are felt, not seen: short fades between steps, nothing
// decorative or bouncy.
export const motion = {
  duration: {
    fast: 150,
    base: 200,
    slow: 250,
  },
};
