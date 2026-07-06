import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { FlowLayout } from '../../components/FlowLayout';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SelectChip } from '../../components/SelectChip';
import { ArrivalMark } from '../../components/ArrivalMark';
import { SessionCompleteScreen } from '../../components/SessionCompleteScreen';
import { useApp } from '../../context/AppContext';
import { MOODS } from '../../constants/moods';
import { LIFE_AREAS, getLifeArea } from '../../constants/lifeAreas';
import { ENCOURAGEMENTS } from '../../constants/encouragements';
import { todayKey, greetingForNow } from '../../utils/date';
import { pickForDate } from '../../utils/pick';
import { colors, radii, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyRecenter'>;

const TOTAL_STEPS = 5;

export function DailyRecenterScreen({ navigation }: Props) {
  const {
    profile,
    dailyEntries,
    saveDailyEntry,
    setFocusCompleted,
    pendingFirstFocus,
    clearPendingFirstFocus,
    justOnboarded,
    clearJustOnboarded,
  } = useApp();
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
  const todaysEntry = dailyEntries[date];

  function close() {
    navigation.goBack();
  }

  function returnHome() {
    navigation.navigate('Main', { screen: 'Home' });
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
        eyebrow="Morning Session"
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
        title="Is there one thing you'll focus on today?"
        subtitle="Completely optional — leave it blank if not."
        primaryLabel="Continue"
        onPrimaryPress={handleFinish}
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
        onPrimaryPress={() => setStep(isFirstSession ? 5 : 6)}
        onClose={close}
        hideDots
      />
    );
  }

  if (step === 5) {
    // First session only — a dedicated, calmer arrival than the standard
    // completion screen, since this is a genuinely different moment.
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

  return (
    <SessionCompleteScreen
      onReturnHome={returnHome}
      onDone={close}
      focus={todaysEntry?.focus || undefined}
      focusCompleted={todaysEntry?.focusCompleted}
      onToggleFocusCompleted={() => setFocusCompleted(date, !todaysEntry?.focusCompleted)}
    />
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
