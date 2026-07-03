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

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const typography = {
  display: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
    fontSize: 30,
    lineHeight: 38,
    color: colors.textPrimary,
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
    fontSize: 22,
    lineHeight: 29,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  bodyMuted: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textTertiary,
  },
};

export const shadow = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
};
