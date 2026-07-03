import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useApp } from '../../context/AppContext';
import { getMood } from '../../constants/moods';
import { getLifeArea } from '../../constants/lifeAreas';
import { todayKey, greetingForNow, formatFriendlyDate } from '../../utils/date';
import { colors, radii, spacing, typography, shadow } from '../../theme/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const { profile, dailyEntries, eveningEntries } = useApp();
  const date = todayKey();
  const daily = dailyEntries[date];
  const evening = eveningEntries[date];
  const mood = daily ? getMood(daily.moodId) : undefined;
  const lifeArea = daily ? getLifeArea(daily.lifeAreaId) : undefined;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.date}>{formatFriendlyDate(date)}</Text>
          <Text style={styles.greeting}>
            {greetingForNow()}
            {profile.name ? `, ${profile.name}` : ''}.
          </Text>
        </View>

        <View style={[styles.card, shadow.soft]}>
          {daily ? (
            <>
              <Text style={styles.cardEyebrow}>Today's focus</Text>
              <Text style={styles.cardTitle}>{daily.focus}</Text>
              <Text style={styles.cardMeta}>
                {mood ? `${mood.icon} ${mood.label}` : ''}
                {lifeArea ? `  ·  ${lifeArea.icon} ${lifeArea.label}` : ''}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.cardEyebrow}>Daily Recenter</Text>
              <Text style={styles.cardTitle}>A quiet moment before your day begins.</Text>
              <PrimaryButton
                label="Begin your Recenter"
                onPress={() => navigation.navigate('DailyRecenter')}
                style={styles.cardButton}
              />
            </>
          )}
        </View>

        <View style={[styles.card, shadow.soft]}>
          {evening ? (
            <>
              <Text style={styles.cardEyebrow}>Evening Reflection</Text>
              <Text style={styles.cardTitle}>You reflected today.</Text>
              <Text style={styles.cardMeta}>{evening.highlight}</Text>
            </>
          ) : (
            <>
              <Text style={styles.cardEyebrow}>Evening Reflection</Text>
              <Text style={styles.cardTitle}>Close your day with a short reflection.</Text>
              <PrimaryButton
                label="Reflect on your day"
                variant="secondary"
                onPress={() => navigation.navigate('EveningReflection')}
                style={styles.cardButton}
              />
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    marginBottom: spacing.sm,
  },
  date: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  greeting: {
    ...typography.display,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  cardEyebrow: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  cardMeta: {
    ...typography.bodyMuted,
  },
  cardButton: {
    marginTop: spacing.md,
  },
});
