import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { useApp } from '../../context/AppContext';
import { colors, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'WhatIsRecenter'>;

const POINTS = [
  'A brief morning check-in and an evening reflection — that’s the whole practice.',
  'One focus at a time. Never a to-do list.',
  'No streaks, no badges, no missed-day guilt.',
];

export function WhatIsRecenterScreen({ navigation }: Props) {
  const { updateProfile } = useApp();

  async function handleContinue() {
    await updateProfile({ onboardingStep: 2 });
    navigation.navigate('ChooseLifeAreas');
  }

  return (
    <OnboardingLayout
      step={1}
      totalSteps={6}
      eyebrow="What is Recenter?"
      title="A quiet daily practice, not another app to keep up with."
      subtitle="Recenter helps you reconnect with what matters most — a couple of quiet minutes, morning and evening."
      primaryLabel="Continue"
      onPrimaryPress={handleContinue}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.list}>
        {POINTS.map((point) => (
          <View key={point} style={styles.row}>
            <Text style={styles.bullet}>—</Text>
            <Text style={styles.point}>{point}</Text>
          </View>
        ))}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bullet: {
    color: colors.accent,
  },
  point: {
    ...typography.body,
    flex: 1,
  },
});
