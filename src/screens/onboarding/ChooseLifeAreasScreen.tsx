import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectChip } from '../../components/SelectChip';
import { LIFE_AREAS } from '../../constants/lifeAreas';
import { useOnboardingDraft } from '../../context/OnboardingDraftContext';
import { spacing } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ChooseLifeAreas'>;

const MAX_AREAS = 5;

export function ChooseLifeAreasScreen({ navigation }: Props) {
  const { draft, setLifeAreaIds } = useOnboardingDraft();

  function toggle(id: string) {
    const isSelected = draft.lifeAreaIds.includes(id);
    if (isSelected) {
      setLifeAreaIds(draft.lifeAreaIds.filter((x) => x !== id));
    } else if (draft.lifeAreaIds.length < MAX_AREAS) {
      setLifeAreaIds([...draft.lifeAreaIds, id]);
    }
  }

  return (
    <OnboardingLayout
      step={4}
      totalSteps={7}
      eyebrow="What matters to you"
      title="Choose a few life areas"
      subtitle={`Pick up to ${MAX_AREAS}. We'll gently remind you of these during your Daily Recenter.`}
      primaryLabel="Continue"
      onPrimaryPress={() => navigation.navigate('YourName')}
      primaryDisabled={draft.lifeAreaIds.length === 0}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.wrap}>
        {LIFE_AREAS.map((area) => (
          <SelectChip
            key={area.id}
            label={area.label}
            icon={area.icon}
            selected={draft.lifeAreaIds.includes(area.id)}
            onPress={() => toggle(area.id)}
          />
        ))}
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
