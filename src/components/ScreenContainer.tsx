import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  // Evening Reflection only: a slightly warmer/dimmer background so the
  // evening moment reads distinct from morning, no layout change.
  backgroundColor?: string;
}

export function ScreenContainer({ children, style, backgroundColor }: Props) {
  return (
    <SafeAreaView style={[styles.safe, backgroundColor ? { backgroundColor } : null]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.content, style]}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
});
