import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectChip } from '../../components/SelectChip';
import { LIFE_AREAS } from '../../constants/lifeAreas';
import { useApp } from '../../context/AppContext';
import { spacing } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ChooseLifeAreas'>;

const REQUIRED_AREAS = 3;

export function ChooseLifeAreasScreen({ navigation }: Props) {
  const { profile, updateProfile } = useApp();
  const selected = profile.lifeAreaIds;

  function toggle(id: string) {
    const isSelected = selected.includes(id);
    if (isSelected) {
      updateProfile({ lifeAreaIds: selected.filter((x) => x !== id) });
    } else if (selected.length < REQUIRED_AREAS) {
      updateProfile({ lifeAreaIds: [...selected, id] });
    }
  }

  async function handleContinue() {
    await updateProfile({ onboardingStep: 3 });
    navigation.navigate('FaithPreference');
  }

  return (
    <OnboardingLayout
      step={2}
      totalSteps={6}
      eyebrow="What matters to you"
      title="Choose 3 life areas"
      subtitle="We'll gently bring these into your Daily Recenter — nothing more to configure."
      primaryLabel="Continue"
      onPrimaryPress={handleContinue}
      primaryDisabled={selected.length !== REQUIRED_AREAS}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.wrap}>
        {LIFE_AREAS.map((area) => {
          const isSelected = selected.includes(area.id);
          return (
            <SelectChip
              key={area.id}
              label={area.label}
              icon={area.icon}
              selected={isSelected}
              onPress={() => toggle(area.id)}
              disabled={!isSelected && selected.length >= REQUIRED_AREAS}
            />
          );
        })}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
