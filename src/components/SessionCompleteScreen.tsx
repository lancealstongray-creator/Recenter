import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { PrimaryButton } from './PrimaryButton';
import { ArrivalMark } from './ArrivalMark';
import { QuietReveal } from './QuietReveal';
import { colors, elevation, motion, radii, spacing, typography } from '../theme/theme';
import { useReducedMotion } from '../utils/motion';

interface Props {
  onReturnHome: () => void;
  /** Only shown when today has a One Focus set. */
  focus?: string;
  focusCompleted?: boolean;
  onToggleFocusCompleted?: () => void;
}

// Session Completion v2 — the Board asked that agency be preserved at
// the app's single most meaningful moment: no countdown, nothing that
// happens without the user choosing it. "Return to Today" and "Sit a
// Moment" are deliberately equal-weight options; "Sit a Moment" doesn't
// open a new screen or timer, it simply holds this same view, and a
// quiet "Return to Today" link fades in after a pause for whenever the
// user is ready to leave.
const SIT_A_MOMENT_PAUSE_MS = 3500;

export function SessionCompleteScreen({ onReturnHome, focus, focusCompleted, onToggleFocusCompleted }: Props) {
  const [isSittingAMoment, setIsSittingAMoment] = useState(false);
  const [showReturnLink, setShowReturnLink] = useState(false);
  const linkOpacity = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isSittingAMoment) return;
    const timer = setTimeout(() => {
      setShowReturnLink(true);
      Animated.timing(linkOpacity, {
        toValue: 1,
        duration: reducedMotion ? motion.duration.base / 2 : motion.duration.base,
        useNativeDriver: true,
      }).start();
    }, SIT_A_MOMENT_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [isSittingAMoment, linkOpacity, reducedMotion]);

  return (
    <ScreenContainer>
      <QuietReveal>
        <View style={[styles.heroCard, elevation.hero]}>
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
        </View>
      </QuietReveal>

      {!isSittingAMoment ? (
        <View style={styles.footer}>
          <PrimaryButton label="Return to Today" onPress={onReturnHome} />
          <PrimaryButton
            label="Sit a Moment"
            variant="secondary"
            onPress={() => setIsSittingAMoment(true)}
            style={styles.sitButton}
          />
        </View>
      ) : showReturnLink ? (
        <Animated.View style={[styles.footer, { opacity: linkOpacity }]}>
          <Pressable onPress={onReturnHome} hitSlop={8} style={styles.returnLinkWrap}>
            <Text style={styles.returnLinkText}>Return to Today</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
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
    paddingTop: spacing.lg,
  },
  sitButton: {
    marginTop: 0,
  },
  returnLinkWrap: {
    alignItems: 'center',
  },
  returnLinkText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
