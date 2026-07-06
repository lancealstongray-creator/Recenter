import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { FlowLayout } from '../../components/FlowLayout';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SelectChip } from '../../components/SelectChip';
import { useApp } from '../../context/AppContext';
import { useReducedMotion } from '../../utils/motion';
import { MOODS } from '../../constants/moods';
import { LIFE_AREAS, getLifeArea } from '../../constants/lifeAreas';
import { ENCOURAGEMENTS } from '../../constants/encouragements';
import { todayKey, greetingForNow } from '../../utils/date';
import { pickForDate } from '../../utils/pick';
import { colors, radii, spacing, typography, motion } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyRecenter'>;

const TOTAL_STEPS = 5;

export function DailyRecenterScreen({ navigation }: Props) {
  const { profile, saveDailyEntry, pendingFirstFocus, clearPendingFirstFocus, justOnboarded, clearJustOnboarded } =
    useApp();
  const [step, setStep] = useState(0);
  const [moodId, setMoodId] = useState<string | null>(null);
  // Seeds from the focus chosen during onboarding's One Focus Setup, if
  // any — consumed once so later sessions start blank as usual.
  const [focus, setFocus] = useState(pendingFirstFocus);
  // Captured once at mount: this is the user's real first Morning Session,
  // run through the exact same engine as every other day. Only this run
  // gets the extra "You're Ready" step before returning to Home.
  const [isFirstSession] = useState(justOnboarded);

  useEffect(() => {
    if (pendingFirstFocus) {
      clearPendingFirstFocus();
    }
    if (justOnboarded) {
      clearJustOnboarded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const date = todayKey();
  const areaIds = profile.lifeAreaIds.length > 0 ? profile.lifeAreaIds : LIFE_AREAS.map((a) => a.id);
  const reminderAreaId = useMemo(() => pickForDate(areaIds, date), [areaIds, date]);
  const reminderArea = getLifeArea(reminderAreaId) ?? LIFE_AREAS[0];
  const encouragement = useMemo(() => pickForDate(ENCOURAGEMENTS, date), [date]);
  const greeting = greetingForNow();

  function close() {
    navigation.goBack();
  }

  async function handleFinish() {
    await saveDailyEntry({
      date,
      moodId: moodId ?? 'calm',
      lifeAreaId: reminderArea.id,
      focus: focus.trim(),
      completedAt: new Date().toISOString(),
    });
    setStep(4);
  }

  if (step === 0) {
    return (
      <FlowLayout
        step={0}
        totalSteps={TOTAL_STEPS}
        eyebrow="Daily Recenter"
        title={`${greeting}${profile.name ? `, ${profile.name}` : ''}.`}
        subtitle="Take a quiet moment before your day picks up speed."
        primaryLabel="Begin"
        onPrimaryPress={() => setStep(1)}
        onClose={close}
      />
    );
  }

  if (step === 1) {
    return (
      <FlowLayout
        step={1}
        totalSteps={TOTAL_STEPS}
        eyebrow="Check in"
        title="How are you feeling?"
        primaryLabel="Continue"
        onPrimaryPress={() => setStep(2)}
        primaryDisabled={!moodId}
        showBack
        onBack={() => setStep(0)}
        onClose={close}
      >
        <View style={styles.wrap}>
          {MOODS.map((mood) => (
            <SelectChip
              key={mood.id}
              label={mood.label}
              icon={mood.icon}
              selected={moodId === mood.id}
              onPress={() => setMoodId(mood.id)}
            />
          ))}
        </View>
      </FlowLayout>
    );
  }

  if (step === 2) {
    return (
      <FlowLayout
        step={2}
        totalSteps={TOTAL_STEPS}
        eyebrow="A reminder"
        title="What matters to you"
        primaryLabel="Continue"
        onPrimaryPress={() => setStep(3)}
        showBack
        onBack={() => setStep(1)}
        onClose={close}
      >
        <View style={styles.reminderCard}>
          <Text style={styles.reminderIcon}>{reminderArea.icon}</Text>
          <Text style={styles.reminderLabel}>{reminderArea.label}</Text>
          <Text style={styles.reminderCopy}>
            You told us this matters to you. Let it quietly shape today.
          </Text>
        </View>
      </FlowLayout>
    );
  }

  if (step === 3) {
    return (
      <FlowLayout
        step={3}
        totalSteps={TOTAL_STEPS}
        eyebrow="One focus"
        title="What's the one thing you'll focus on today?"
        subtitle="Just one. Small is fine."
        primaryLabel="Continue"
        onPrimaryPress={handleFinish}
        primaryDisabled={focus.trim().length === 0}
        showBack
        onBack={() => setStep(2)}
        onClose={close}
      >
        <TextInput
          style={styles.input}
          placeholder={`e.g. "Be present with ${reminderArea.label.toLowerCase()}"`}
          placeholderTextColor={colors.textTertiary}
          value={focus}
          onChangeText={setFocus}
          multiline
          maxLength={140}
        />
      </FlowLayout>
    );
  }

  if (step === 4) {
    return (
      <FlowLayout
        step={4}
        totalSteps={TOTAL_STEPS}
        eyebrow="Encouragement"
        title={encouragement}
        primaryLabel="Close"
        onPrimaryPress={isFirstSession ? () => setStep(5) : close}
        onClose={close}
        hideDots
      />
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.readyCenter}>
        <ArrivalMark>
          <Text style={styles.readyMarkGlyph}>✓</Text>
        </ArrivalMark>
        <Text style={styles.readyTitle} accessibilityRole="header">
          You're ready.
        </Text>
        <Text style={styles.readySubtitle}>
          That's the whole practice — a quiet moment, morning and evening. Nothing else to set up.
        </Text>
      </View>
      <View style={styles.readyFooter}>
        <PrimaryButton label="Continue to Home" onPress={close} />
      </View>
    </ScreenContainer>
  );
}

// The signature "you're done" moment: scale 0.85→1 + fade, arrive easing,
// slow duration. No bounce, no overshoot.
function ArrivalMark({ children }: { children: React.ReactNode }) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const duration = reducedMotion ? motion.duration.base / 2 : motion.duration.slow;
    scale.setValue(reducedMotion ? 1 : 0.85);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration,
        easing: Easing.bezier(...motion.easing.arrive),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.readyMark, { opacity, transform: [{ scale }] }]}>{children}</Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  readyCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyMark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  readyMarkGlyph: {
    fontSize: 28,
    color: colors.accentDark,
  },
  readyTitle: {
    ...typography.hero,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  readySubtitle: {
    ...typography.bodyMuted,
    textAlign: 'center',
    maxWidth: 300,
  },
  readyFooter: {
    paddingBottom: spacing.xl,
  },
  reminderCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  reminderIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  reminderLabel: {
    ...typography.title,
    color: colors.accentDark,
    marginBottom: spacing.sm,
  },
  reminderCopy: {
    ...typography.bodyMuted,
    textAlign: 'center',
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.lg,
    minHeight: 96,
    textAlignVertical: 'top',
  },
});
