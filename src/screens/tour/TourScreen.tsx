import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { FlowLayout } from '../../components/FlowLayout';
import { useApp } from '../../context/AppContext';
import { colors, radii, spacing } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Tour'>;

type IoniconName = keyof typeof Ionicons.glyphMap;

const STOPS: { icon: IoniconName; title: string; body: string }[] = [
  {
    icon: 'home-outline',
    title: 'Home',
    body: 'Your day starts here — a quiet greeting and a single next step, never a list of tasks.',
  },
  {
    icon: 'sunny-outline',
    title: "Today's Focus",
    body: 'Whatever you choose each morning shows up gently here for the rest of the day.',
  },
  {
    icon: 'book-outline',
    title: 'Journey',
    body: 'A record of the moments you’ve shown up for yourself — never a scoreboard.',
  },
  {
    icon: 'person-outline',
    title: 'Profile',
    body: 'Your life areas, faith preference, and reminders live here, whenever you want to adjust them.',
  },
];

export function TourScreen({ navigation }: Props) {
  const { updateProfile } = useApp();
  const [step, setStep] = useState(0);

  async function finishTour() {
    await updateProfile({ hasSeenTour: true });
    navigation.goBack();
  }

  const stop = STOPS[step];
  const isLast = step === STOPS.length - 1;

  return (
    <FlowLayout
      step={step}
      totalSteps={STOPS.length}
      eyebrow="Quick tour"
      title={stop.title}
      primaryLabel={isLast ? 'Done' : 'Next'}
      onPrimaryPress={isLast ? finishTour : () => setStep(step + 1)}
      showBack={step > 0}
      onBack={() => setStep(step - 1)}
      onClose={finishTour}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={stop.icon} size={32} color={colors.accentDark} />
      </View>
      <Text style={styles.body}>{stop.body}</Text>
    </FlowLayout>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.textSecondary,
  },
});
