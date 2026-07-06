import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { FAITH_PREFERENCES } from '../../constants/faithPreferences';
import { useApp } from '../../context/AppContext';
import { FaithPreference } from '../../types';
import { spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'FaithPreference'>;

export function FaithPreferenceScreen({ navigation }: Props) {
  const { profile, updateProfile } = useApp();

  function select(id: Exclude<FaithPreference, null>) {
    updateProfile({ faithPreference: id });
  }

  async function handleContinue() {
    await updateProfile({ onboardingStep: 4 });
    navigation.navigate('OneFocusSetup');
  }

  return (
    <OnboardingLayout
      step={3}
      totalSteps={6}
      eyebrow="Faith-Based Encouragement · Optional"
      title="Would you like faith-based encouragement?"
      primaryLabel="Continue"
      onPrimaryPress={handleContinue}
      primaryDisabled={!profile.faithPreference}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.list}>
        {FAITH_PREFERENCES.map((option) => (
          <SelectionCard
            key={option.id}
            title={option.label}
            selected={profile.faithPreference === option.id}
            onPress={() => select(option.id)}
          />
        ))}
      </View>
      <Text style={styles.helper}>You can change this anytime in Profile.</Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  helper: {
    ...typography.caption,
    marginTop: spacing.lg,
  },
});
