import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from './ScreenContainer';
import { ProgressDots } from './ProgressDots';
import { PrimaryButton } from './PrimaryButton';
import { StepFade } from './StepFade';
import { colors, spacing, typography } from '../theme/theme';

interface Props {
  step: number;
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
  onClose: () => void;
  // Hides the step dots for a beat that isn't really "a step" — the
  // closing encouragement in Daily Recenter, for example — so "done"
  // reads visibly different from "still going."
  hideDots?: boolean;
  backgroundColor?: string;
}

export function FlowLayout({
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
  onClose,
  hideDots,
  backgroundColor,
}: Props) {
  return (
    <ScreenContainer backgroundColor={backgroundColor}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={20} color={colors.textTertiary} />
        </Pressable>
        {hideDots ? null : <ProgressDots total={totalSteps} current={step} />}
        <View style={styles.closeSpacer} />
      </View>
      <StepFade stepKey={step}>
        <View style={styles.body}>
          {eyebrow ? (
            <Text style={styles.eyebrow} accessibilityElementsHidden>
              {eyebrow}
            </Text>
          ) : null}
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {children ? <View style={styles.extra}>{children}</View> : null}
        </View>
      </StepFade>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  closeSpacer: {
    width: 44,
  },
  body: {
    flex: 1,
  },
  eyebrow: {
    ...typography.label,
    textTransform: 'uppercase',
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
    marginTop: spacing.xxl,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  backButton: {
    flex: 0,
    paddingHorizontal: spacing.lg,
  },
  grow: {
    flex: 1,
  },
});
