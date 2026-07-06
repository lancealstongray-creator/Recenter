import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { QuietReveal } from '../../components/QuietReveal';
import { InlineNotice } from '../../components/InlineNotice';
import { SessionPickerSheet } from '../../components/SessionPickerSheet';
import { useApp } from '../../context/AppContext';
import { ENCOURAGEMENTS } from '../../constants/encouragements';
import { CALMING_MESSAGES } from '../../constants/calmingMessages';
import { SESSION_META } from '../../constants/sessionTypes';
import { getTimeWindow } from '../../utils/adaptiveRhythms';
import { getRecommendation } from '../../utils/recommendation';
import { useIsOffline } from '../../utils/connectivity';
import { todayKey, greetingForNow, formatFriendlyDate } from '../../utils/date';
import { pickForDate } from '../../utils/pick';
import { SessionType } from '../../types';
import { colors, radii, spacing, typography, elevation } from '../../theme/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const SESSION_ROUTE: Record<SessionType, keyof RootStackParamList> = {
  morning: 'DailyRecenter',
  midday: 'MiddayReset',
  evening: 'EveningReflection',
  windDown: 'WindDown',
};

const SESSION_BEGIN_LABEL: Record<SessionType, string> = {
  morning: 'Begin Today',
  midday: 'Begin Reset',
  evening: 'Take a Moment',
  windDown: 'Begin Wind Down',
};

export function HomeScreen({ navigation }: Props) {
  const { profile, dailyEntries, eveningEntries, middayEntries, windDownEntries, updateProfile, errorMessage, clearErrorMessage } =
    useApp();
  const isOffline = useIsOffline();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const date = todayKey();
  const now = useMemo(() => new Date(), [date]);

  const daily = dailyEntries[date];
  const evening = eveningEntries[date];
  const midday = middayEntries[date];
  const windDown = windDownEntries[date];

  const completedToday: Partial<Record<SessionType, boolean>> = {
    morning: Boolean(daily),
    midday: Boolean(midday),
    evening: Boolean(evening),
    windDown: Boolean(windDown),
  };

  // "Typical usage patterns stored locally" — every date each session
  // type has ever been completed, feeding the confidence layer in
  // recommendation.ts. Selection of WHICH session is recommended is
  // still owned entirely by adaptiveRhythms.ts; this only lets Today's
  // copy read as a personal suggestion once a real pattern has formed.
  const completedDatesByType: Record<SessionType, string[]> = {
    morning: Object.keys(dailyEntries),
    midday: Object.keys(middayEntries),
    evening: Object.keys(eveningEntries),
    windDown: Object.keys(windDownEntries),
  };
  const recommendation = useMemo(
    () => getRecommendation({ now, completedToday, completedDatesByType }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [now, completedToday, dailyEntries, middayEntries, eveningEntries, windDownEntries]
  );
  const recommended = recommendation?.sessionType ?? null;

  const hasEverUsedType: Record<SessionType, boolean> = {
    morning: Object.keys(dailyEntries).length > 0,
    midday: Object.keys(middayEntries).length > 0,
    evening: Object.keys(eveningEntries).length > 0,
    windDown: Object.keys(windDownEntries).length > 0,
  };
  const isFirstTimeEver = !Object.values(hasEverUsedType).some(Boolean);

  const encouragement = useMemo(() => pickForDate(ENCOURAGEMENTS, date), [date]);
  const calmingMessage = CALMING_MESSAGES[getTimeWindow(now)];

  function dismissTourPrompt() {
    updateProfile({ hasSeenTour: true });
  }

  function beginSession(type: SessionType) {
    navigation.navigate(SESSION_ROUTE[type] as never);
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {isOffline ? (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              You're offline — Recenter still works. Everything is saved on this device.
            </Text>
          </View>
        ) : null}

        {errorMessage ? <InlineNotice message={errorMessage} onRetry={clearErrorMessage} /> : null}

        {/* 1. Time-aware greeting */}
        <View style={styles.header}>
          <Text style={styles.date}>{formatFriendlyDate(date)}</Text>
          <Text style={styles.greeting} accessibilityRole="header">
            {greetingForNow()}
            {profile.name ? `, ${profile.name}` : ''}.
          </Text>
          {/* 2. Short calming message */}
          <Text style={styles.calmingMessage}>{calmingMessage}</Text>
        </View>

        {/* 3 + 4. Today's Recommended Session card + primary Begin Session button */}
        {recommended ? (
          <QuietReveal>
            <View style={[styles.card, elevation.soft]}>
              <Text style={styles.cardEyebrow}>
                {recommendation?.confident ? 'Suggested for you' : SESSION_META[recommended].label}
              </Text>
              <Text style={styles.cardTitle}>
                {isFirstTimeEver
                  ? "Let's begin your first moment together."
                  : !hasEverUsedType[recommended]
                    ? `A first ${SESSION_META[recommended].label.toLowerCase()} for you.`
                    : recommendation?.confident && recommendation.reasonCopy
                      ? recommendation.reasonCopy
                      : SESSION_META[recommended].blurb}
              </Text>
              <PrimaryButton
                label={SESSION_BEGIN_LABEL[recommended]}
                onPress={() => beginSession(recommended)}
                style={styles.cardButton}
              />
              <Pressable onPress={() => setIsPickerVisible(true)} hitSlop={8} style={styles.pickerLink}>
                <Text style={styles.pickerLinkText}>Or choose something else</Text>
              </Pressable>
            </View>
          </QuietReveal>
        ) : (
          // Empty state: every session for today is complete. Calm rest,
          // not an overdue list or a score.
          <QuietReveal>
            <Text style={styles.restingMessage}>You've shown up for yourself today. That's enough.</Text>
          </QuietReveal>
        )}

        {/* 5. Today's One Focus — only if present */}
        {daily ? (
          <QuietReveal>
            {daily.focus ? (
              <View style={styles.quietBlock}>
                <View style={styles.focusHeaderRow}>
                  <Text style={styles.quietLabel}>Today, you're holding space for</Text>
                  {daily.focusCompleted ? <Text style={styles.focusDoneBadge}>✓ complete</Text> : null}
                </View>
                <Text style={styles.quietFocus}>{daily.focus}</Text>
              </View>
            ) : (
              // Empty state: no One Focus selected.
              <View style={styles.quietBlock}>
                <Text style={styles.quietLabel}>No focus set for today</Text>
                <Text style={styles.emptyStateText}>That's completely fine — not every day needs one.</Text>
              </View>
            )}
          </QuietReveal>
        ) : null}

        {evening ? (
          <QuietReveal>
            <View style={styles.quietBlock}>
              <Text style={styles.quietLabel}>This evening, you noticed</Text>
              <Text style={styles.quietFocus}>{evening.highlight}</Text>
            </View>
          </QuietReveal>
        ) : null}

        {/* 6. Daily encouragement */}
        <Text style={styles.quote}>{encouragement}</Text>

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
      <SessionPickerSheet
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelect={beginSession}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  offlineBanner: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    padding: spacing.md,
  },
  offlineText: {
    ...typography.caption,
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
  calmingMessage: {
    ...typography.bodyMuted,
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
  pickerLink: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  pickerLinkText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  quietBlock: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  focusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  focusDoneBadge: {
    ...typography.label,
    color: colors.accentDark,
    marginBottom: 0,
  },
  quietLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  quietFocus: {
    ...typography.quote,
    color: colors.textPrimary,
  },
  emptyStateText: {
    ...typography.bodyMuted,
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
