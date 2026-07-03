import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { spacing, typography, colors, radii } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'HowDailyRecenterWorks'>;

const STEPS = [
  { icon: '☀️', label: 'A quiet greeting' },
  { icon: '🙂', label: 'Name how you feel' },
  { icon: '🧭', label: "A gentle reminder of what matters" },
  { icon: '🎯', label: 'One focus for today' },
  { icon: '💛', label: 'A word of encouragement' },
];

export function HowDailyRecenterWorksScreen({ navigation }: Props) {
  return (
    <OnboardingLayout
      step={2}
      totalSteps={7}
      eyebrow="Each morning"
      title="The Daily Recenter"
      subtitle="Five small moments, under a minute, to start your day with intention."
      primaryLabel="Continue"
      onPrimaryPress={() => navigation.navigate('HowEveningReflectionWorks')}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.steps}>
        {STEPS.map((s, i) => (
          <View key={s.label} style={styles.stepRow}>
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{s.icon}</Text>
            </View>
            <Text style={styles.stepLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  steps: {
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  stepLabel: {
    ...typography.body,
  },
});
