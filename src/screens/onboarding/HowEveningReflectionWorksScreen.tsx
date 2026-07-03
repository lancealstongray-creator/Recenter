import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { EVENING_PROMPTS } from '../../constants/prompts';
import { spacing, typography, colors } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'HowEveningReflectionWorks'>;

export function HowEveningReflectionWorksScreen({ navigation }: Props) {
  return (
    <OnboardingLayout
      step={3}
      totalSteps={7}
      eyebrow="Each evening"
      title="A short reflection"
      subtitle="Three brief prompts and an optional note — a gentle way to close the day."
      primaryLabel="Continue"
      onPrimaryPress={() => navigation.navigate('ChooseLifeAreas')}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.list}>
        {EVENING_PROMPTS.map((p, i) => (
          <Text key={p.key} style={styles.prompt}>
            {i + 1}. {p.question}
          </Text>
        ))}
        <Text style={styles.prompt}>+ An optional note, if you want to say more.</Text>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  prompt: {
    ...typography.body,
  },
});
