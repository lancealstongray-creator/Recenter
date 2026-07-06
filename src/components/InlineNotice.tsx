import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

interface Props {
  message: string;
  onRetry?: () => void;
}

// The one shared error pattern in the app — appears directly beneath
// whatever failed, never a modal, never a toast. No icon-of-alarm: error
// (#B3564B) is a muted terracotta, not a warning red.
export function InlineNotice({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} hitSlop={8}>
          <Text style={styles.action}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.errorSoft,
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  message: {
    ...typography.bodyMuted,
    color: colors.error,
  },
  action: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
  },
});
