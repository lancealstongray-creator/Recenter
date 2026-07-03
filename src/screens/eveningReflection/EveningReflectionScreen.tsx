import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { FlowLayout } from '../../components/FlowLayout';
import { useApp } from '../../context/AppContext';
import { EVENING_PROMPTS } from '../../constants/prompts';
import { todayKey } from '../../utils/date';
import { colors, radii, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EveningReflection'>;

// 3 prompt steps + 1 optional-note step
const TOTAL_STEPS = 4;

export function EveningReflectionScreen({ navigation }: Props) {
  const { saveEveningEntry } = useApp();
  const [step, setStep] = useState(0);
  const [highlight, setHighlight] = useState('');
  const [challenge, setChallenge] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [note, setNote] = useState('');

  function close() {
    navigation.goBack();
  }

  async function handleSave() {
    await saveEveningEntry({
      date: todayKey(),
      highlight: highlight.trim(),
      challenge: challenge.trim(),
      gratitude: gratitude.trim(),
      note: note.trim() || undefined,
      completedAt: new Date().toISOString(),
    });
    navigation.goBack();
  }

  const answers = [highlight, challenge, gratitude];
  const setters = [setHighlight, setChallenge, setGratitude];

  if (step < 3) {
    const prompt = EVENING_PROMPTS[step];
    return (
      <FlowLayout
        step={step}
        totalSteps={TOTAL_STEPS}
        eyebrow="Evening Reflection"
        title={prompt.question}
        primaryLabel="Continue"
        onPrimaryPress={() => setStep(step + 1)}
        primaryDisabled={answers[step].trim().length === 0}
        showBack={step > 0}
        onBack={() => setStep(step - 1)}
        onClose={close}
      >
        <TextInput
          style={styles.input}
          placeholder="Take a moment..."
          placeholderTextColor={colors.textTertiary}
          value={answers[step]}
          onChangeText={setters[step]}
          multiline
          maxLength={200}
          autoFocus
        />
      </FlowLayout>
    );
  }

  return (
    <FlowLayout
      step={3}
      totalSteps={TOTAL_STEPS}
      eyebrow="Optional"
      title="Anything else on your mind?"
      subtitle="Completely optional — leave it blank if not."
      primaryLabel="Finish"
      onPrimaryPress={handleSave}
      showBack
      onBack={() => setStep(2)}
      onClose={close}
    >
      <TextInput
        style={styles.input}
        placeholder="A note to yourself..."
        placeholderTextColor={colors.textTertiary}
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={400}
      />
    </FlowLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
