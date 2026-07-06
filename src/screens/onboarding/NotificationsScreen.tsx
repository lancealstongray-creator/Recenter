import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { useApp } from '../../context/AppContext';
import { requestNotificationPermission } from '../../utils/notifications';
import { spacing } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Notifications'>;

type Choice = 'yes' | 'not_now';

export function NotificationsScreen({ navigation }: Props) {
  const { profile, updateProfile, completeOnboarding } = useApp();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  async function handleContinue() {
    if (!choice) return;
    setIsFinishing(true);
    let granted = false;
    if (choice === 'yes') {
      granted = await requestNotificationPermission();
    }
    await completeOnboarding({
      lifeAreaIds: profile.lifeAreaIds,
      faithPreference: profile.faithPreference,
      notificationsEnabled: granted,
      draftFocus: profile.draftFocus,
    });
  }

  return (
    <OnboardingLayout
      step={5}
      totalSteps={6}
      eyebrow="Optional"
      title="Would you like a gentle daily reminder?"
      subtitle="Never urgent, never a nag — just a quiet nudge if that helps."
      primaryLabel="Continue"
      onPrimaryPress={handleContinue}
      primaryDisabled={!choice || isFinishing}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.list}>
        <SelectionCard
          title="Yes, remind me"
          description="We'll ask permission from your device."
          selected={choice === 'yes'}
          onPress={() => setChoice('yes')}
        />
        <SelectionCard
          title="Not now"
          description="You can turn this on anytime in Profile."
          selected={choice === 'not_now'}
          onPress={() => setChoice('not_now')}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
