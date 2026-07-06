import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { QuietReveal } from '../../components/QuietReveal';
import { useApp } from '../../context/AppContext';
import { ENCOURAGEMENTS } from '../../constants/encouragements';
import { todayKey, greetingForNow, formatFriendlyDate } from '../../utils/date';
import { pickForDate } from '../../utils/pick';
import { colors, radii, spacing, typography, elevation } from '../../theme/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const { profile, dailyEntries, eveningEntries, updateProfile } = useApp();
  const date = todayKey();
  const daily = dailyEntries[date];
  const evening = eveningEntries[date];
  const dailyDone = Boolean(daily);
  const eveningDone = Boolean(evening);
  const encouragement = useMemo(() => pickForDate(ENCOURAGEMENTS, date), [date]);

  function dismissTourPrompt() {
    updateProfile({ hasSeenTour: true });
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.date}>{formatFriendlyDate(date)}</Text>
          <Text style={styles.greeting} accessibilityRole="header">
            {greetingForNow()}
            {profile.name ? `, ${profile.name}` : ''}.
          </Text>
          <Text style={styles.quote}>{encouragement}</Text>
        </View>

        {dailyDone ? (
          <QuietReveal>
            <View style={styles.quietBlock}>
              <Text style={styles.quietLabel}>Today, you're holding space for</Text>
              <Text style={styles.quietFocus}>{daily.focus}</Text>
            </View>
          </QuietReveal>
        ) : (
          <QuietReveal>
            <View style={[styles.card, elevation.soft]}>
              <Text style={styles.cardEyebrow}>Daily Recenter</Text>
              <Text style={styles.cardTitle}>A quiet moment before your day begins.</Text>
              <PrimaryButton
                label="Begin Today"
                onPress={() => navigation.navigate('DailyRecenter')}
                style={styles.cardButton}
              />
            </View>
          </QuietReveal>
        )}

        {dailyDone && !eveningDone ? (
          <QuietReveal>
            <View style={[styles.card, elevation.soft]}>
              <Text style={styles.cardEyebrow}>Evening Reflection</Text>
              <Text style={styles.cardTitle}>Take a few quiet minutes to reflect on your day.</Text>
              <PrimaryButton
                label="Take a Moment"
                onPress={() => navigation.navigate('EveningReflection')}
                style={styles.cardButton}
              />
            </View>
          </QuietReveal>
        ) : null}

        {eveningDone ? (
          <QuietReveal>
            <View style={styles.quietBlock}>
              <Text style={styles.quietLabel}>This evening, you noticed</Text>
              <Text style={styles.quietFocus}>{evening.highlight}</Text>
            </View>
          </QuietReveal>
        ) : null}

        {dailyDone && eveningDone ? (
          <QuietReveal>
            <Text style={styles.restingMessage}>You've shown up for yourself today. That's enough.</Text>
          </QuietReveal>
        ) : null}

        {!profile.hasSeenTour ? (
          <View style={styles.tourPrompt}>
            <Text style={styles.tourText}>Take a quick tour?</Text>
            <View style={styles.tourActions}>
              <Pressable onPress={dismissTourPrompt} hitSlop={8}>
                <Text style={styles.tourLinkMuted}>Not now</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate('Tour')} hitSlop={8}>
                <Text style={styles.tourLink}>Take the tour</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  header: {
    marginBottom: spacing.sm,
  },
  date: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  greeting: {
    ...typography.hero,
    marginBottom: spacing.md,
  },
  quote: {
    ...typography.quote,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  cardEyebrow: {
    ...typography.label,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.title,
    marginBottom: spacing.lg,
  },
  cardButton: {
    marginTop: spacing.xs,
  },
  quietBlock: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  quietLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  quietFocus: {
    ...typography.quote,
    color: colors.textPrimary,
  },
  restingMessage: {
    ...typography.quote,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  tourPrompt: {
    paddingHorizontal: spacing.xs,
  },
  tourText: {
    ...typography.bodyMuted,
    marginBottom: spacing.sm,
  },
  tourActions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  tourLink: {
    ...typography.body,
    color: colors.accentDark,
    fontWeight: '600',
  },
  tourLinkMuted: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
