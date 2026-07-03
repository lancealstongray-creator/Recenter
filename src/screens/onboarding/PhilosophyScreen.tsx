import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { colors, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Philosophy'>;

const POINTS = [
  'No streaks to maintain.',
  'No badges or points to chase.',
  'No "missed day" warnings — ever.',
];

export function PhilosophyScreen({ navigation }: Props) {
  return (
    <OnboardingLayout
      step={1}
      totalSteps={7}
      eyebrow="Our philosophy"
      title="This isn't another habit to keep up with."
      subtitle="Recenter is a quiet daily pause, not a performance. Show up when it helps — nothing is tracked against you."
      primaryLabel="Continue"
      onPrimaryPress={() => navigation.navigate('HowDailyRecenterWorks')}
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
