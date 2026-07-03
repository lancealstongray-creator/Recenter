import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressDots } from '../../components/ProgressDots';
import { useOnboardingDraft } from '../../context/OnboardingDraftContext';
import { useApp } from '../../context/AppContext';
import { colors, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Ready'>;

export function ReadyScreen({}: Props) {
  const { draft } = useOnboardingDraft();
  const { completeOnboarding } = useApp();

  async function handleStart() {
    await completeOnboarding({
      name: draft.name.trim(),
      lifeAreaIds: draft.lifeAreaIds,
    });
  }

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <ProgressDots total={7} current={6} />
      </View>
      <View style={styles.center}>
        <View style={styles.mark}>
          <Text style={styles.markGlyph}>✓</Text>
        </View>
        <Text style={styles.title}>
          {draft.name.trim() ? `You're ready, ${draft.name.trim()}.` : "You're ready."}
        </Text>
        <Text style={styles.subtitle}>
          One quiet moment each morning, one each evening. That's all Recenter asks of you.
        </Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Start Recentering" onPress={handleStart} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  markGlyph: {
    fontSize: 28,
    color: colors.accentDark,
  },
  title: {
    ...typography.display,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyMuted,
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});
