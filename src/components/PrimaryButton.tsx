import React from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';
import { usePressScale } from '../utils/motion';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, disabled, loading, variant = 'primary', style }: Props) {
  const isSecondary = variant === 'secondary';
  const { scale, onPressIn, onPressOut } = usePressScale();
  // The scale wrapper needs to grow in a flex row exactly like the
  // Pressable would have on its own — carry `flex` over so `style={{flex:1}}`
  // callers (e.g. FlowLayout's side-by-side Back/Continue) keep working.
  // Only forwarded when truthy: on web, an explicit `flex: 0` compiles to
  // `flex-basis: 0%` (unlike RN's content-based sizing), which collapses
  // the wrapper's width — so flex:0 is left unset and sizes by content,
  // matching the pre-wrapper behavior exactly.
  const flexStyle = style && 'flex' in style && style.flex ? { flex: style.flex } : undefined;

  return (
    <Animated.View style={[flexStyle, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || loading }}
        style={({ pressed }) => [
          styles.base,
          isSecondary ? styles.secondary : styles.primary,
          (disabled || loading) && styles.disabled,
          pressed && !disabled && !loading && styles.pressed,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isSecondary ? colors.accentDark : colors.white} />
        ) : (
          <Text style={[styles.label, isSecondary ? styles.labelSecondary : styles.labelPrimary]}>{label}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelPrimary: {
    color: colors.white,
  },
  labelSecondary: {
    color: colors.textPrimary,
  },
});
