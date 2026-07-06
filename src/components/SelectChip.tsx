import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';
import { usePressScale } from '../utils/motion';

interface Props {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function SelectChip({ label, icon, selected, onPress, disabled }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <Animated.View style={disabled ? styles.disabled : { transform: [{ scale }] }}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={disabled ? undefined : onPressIn}
        onPressOut={disabled ? undefined : onPressOut}
        style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected, disabled }}
        hitSlop={4}
      >
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    gap: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  labelSelected: {
    color: colors.accentDark,
  },
});
