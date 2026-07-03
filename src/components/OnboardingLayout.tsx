import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { ProgressDots } from './ProgressDots';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing, typography } from '../theme/theme';

interface Props {
  step: number; // 0-indexed
  totalSteps: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  primaryLabel: string;
  onPrimaryPress: () => void;
  primaryDisabled?: boolean;
  onBack?: () => void;
  showBack?: boolean;
}

export function OnboardingLayout({
  step,
  totalSteps,
  eyebrow,
  title,
  subtitle,
  children,
  primaryLabel,
  onPrimaryPress,
  primaryDisabled,
  onBack,
  showBack,
}: Props) {
  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <ProgressDots total={totalSteps} current={step} />
      </View>
      <View style={styles.body}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children ? <View style={styles.extra}>{children}</View> : null}
      </View>
      <View style={styles.footer}>
        {showBack ? (
          <PrimaryButton label="Back" variant="secondary" onPress={onBack ?? (() => {})} style={styles.backButton} />
        ) : null}
        <PrimaryButton label={primaryLabel} onPress={onPrimaryPress} disabled={primaryDisabled} style={styles.grow} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  body: {
    flex: 1,
  },
  eyebrow: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.display,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyMuted,
  },
  extra: {
    marginTop: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  backButton: {
    flex: 0,
    paddingHorizontal: spacing.lg,
  },
  grow: {
    flex: 1,
  },
});
