import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { FlowLayout } from '../../components/FlowLayout';
import { SessionCompleteScreen } from '../../components/SessionCompleteScreen';
import { useApp } from '../../context/AppContext';
import { todayKey } from '../../utils/date';
import { colors, radii, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MiddayReset'>;

const TOTAL_STEPS = 2;

export function MiddayResetScreen({ navigation }: Props) {
  const { dailyEntries, saveMiddayEntry, setFocusCompleted } = useApp();
  const [step, setStep] = useState(0);
  const [note, setNote] = useState('');
  const date = todayKey();
  const todaysEntry = dailyEntries[date];

  function close() {
    navigation.goBack();
  }

  function returnHome() {
    navigation.navigate('Main', { screen: 'Home' });
  }

  async function handleFinish() {
    await saveMiddayEntry({
      date,
      note: note.trim() || undefined,
      completedAt: new Date().toISOString(),
    });
    setStep(2);
  }

  if (step === 0) {
    return (
      <FlowLayout
        step={0}
        totalSteps={TOTAL_STEPS}
        eyebrow="Midday Reset"
        title="A midday pause."
        subtitle="A brief pause to reset in the middle of your day."
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
        eyebrow="Midday Reset"
        title="What's one thing you can let go of right now?"
        subtitle="Completely optional — leave it blank if not."
        primaryLabel="Continue"
        onPrimaryPress={handleFinish}
        showBack
        onBack={() => setStep(0)}
        onClose={close}
      >
        <TextInput
          style={styles.input}
          placeholder="Take a moment..."
          placeholderTextColor={colors.textTertiary}
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={200}
        />
      </FlowLayout>
    );
  }

  return (
    <SessionCompleteScreen
      onReturnHome={returnHome}
      focus={todaysEntry?.focus || undefined}
      focusCompleted={todaysEntry?.focusCompleted}
      onToggleFocusCompleted={() => setFocusCompleted(date, !todaysEntry?.focusCompleted)}
    />
  );
}

const styles = StyleSheet.create({
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
