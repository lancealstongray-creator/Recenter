import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { PrimaryButton } from './PrimaryButton';
import { ArrivalMark } from './ArrivalMark';
import { QuietReveal } from './QuietReveal';
import { colors, radii, spacing, typography } from '../theme/theme';

interface Props {
  onReturnHome: () => void;
  onDone: () => void;
  /** Only shown when today has a One Focus set. */
  focus?: string;
  focusCompleted?: boolean;
  onToggleFocusCompleted?: () => void;
}

// The universal ending for any of the four session types — never a
// celebration burst, just a quiet arrival.
export function SessionCompleteScreen({ onReturnHome, onDone, focus, focusCompleted, onToggleFocusCompleted }: Props) {
  return (
    <ScreenContainer>
      <QuietReveal>
        <View style={styles.center}>
          <ArrivalMark>
            <Text style={styles.markGlyph}>✓</Text>
          </ArrivalMark>
          <Text style={styles.title} accessibilityRole="header">
            Nice work.
          </Text>
          <Text style={styles.subtitle}>You've taken a moment to reconnect with what matters today.</Text>

          {focus ? (
            <Pressable
              onPress={onToggleFocusCompleted}
              disabled={!onToggleFocusCompleted}
              style={styles.focusRow}
              accessibilityRole="button"
              accessibilityLabel={focusCompleted ? 'Mark focus as active' : 'Mark focus as complete'}
              accessibilityState={{ selected: focusCompleted }}
            >
              <View style={[styles.focusCheck, focusCompleted && styles.focusCheckDone]}>
                {focusCompleted ? <Text style={styles.focusCheckGlyph}>✓</Text> : null}
              </View>
              <View style={styles.focusText}>
                <Text style={styles.focusLabel}>Today's focus</Text>
                <Text style={styles.focusValue}>{focus}</Text>
              </View>
            </Pressable>
          ) : null}
        </View>
      </QuietReveal>
      <View style={styles.footer}>
        <PrimaryButton label="Return Home" onPress={onReturnHome} />
        <PrimaryButton label="Done" variant="secondary" onPress={onDone} style={styles.doneButton} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markGlyph: {
    fontSize: 28,
    color: colors.accentDark,
  },
  title: {
    ...typography.hero,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyMuted,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: spacing.xl,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.lg,
    maxWidth: 320,
  },
  focusCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusCheckDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  focusCheckGlyph: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  focusText: {
    flex: 1,
  },
  focusLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  focusValue: {
    ...typography.body,
  },
  footer: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  doneButton: {
    marginTop: 0,
  },
});
