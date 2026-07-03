import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { useOnboardingDraft } from '../../context/OnboardingDraftContext';
import { colors, radii, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'YourName'>;

export function YourNameScreen({ navigation }: Props) {
  const { draft, setName } = useOnboardingDraft();

  return (
    <OnboardingLayout
      step={5}
      totalSteps={7}
      eyebrow="Optional"
      title="What should we call you?"
      subtitle="This just helps your greeting feel a little more like yours."
      primaryLabel="Continue"
      onPrimaryPress={() => navigation.navigate('Ready')}
      showBack
      onBack={() => navigation.goBack()}
    >
      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={colors.textTertiary}
        value={draft.name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="done"
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});
