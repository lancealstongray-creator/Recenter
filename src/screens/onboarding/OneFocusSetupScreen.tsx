import React, { useMemo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectChip } from '../../components/SelectChip';
import { suggestionsForAreas } from '../../constants/focusSuggestions';
import { useApp } from '../../context/AppContext';
import { colors, radii, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OneFocusSetup'>;

export function OneFocusSetupScreen({ navigation }: Props) {
  const { profile, updateProfile } = useApp();
  const suggestions = useMemo(() => suggestionsForAreas(profile.lifeAreaIds), [profile.lifeAreaIds]);

  async function goToNotifications(step: number) {
    await updateProfile({ onboardingStep: step });
    navigation.navigate('Notifications');
  }

  return (
    <OnboardingLayout
      step={4}
      totalSteps={6}
      eyebrow="One focus"
      title="Is there something you'd like to focus on?"
      subtitle="Pick a suggestion, write your own, or skip — you can always set this each morning."
      primaryLabel="Continue"
      onPrimaryPress={() => goToNotifications(5)}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.body}>
        {suggestions.length > 0 ? (
          <View style={styles.wrap}>
            {suggestions.map((suggestion) => (
              <SelectChip
                key={suggestion}
                label={suggestion}
                selected={profile.draftFocus === suggestion}
                onPress={() => updateProfile({ draftFocus: suggestion })}
              />
            ))}
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Or write your own..."
          placeholderTextColor={colors.textTertiary}
          value={profile.draftFocus}
          onChangeText={(text) => updateProfile({ draftFocus: text })}
          multiline
          maxLength={140}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.lg,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.lg,
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
