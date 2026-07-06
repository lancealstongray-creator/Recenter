import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { PageTurn } from '../../components/PageTurn';
import { InlineNotice } from '../../components/InlineNotice';
import { useApp } from '../../context/AppContext';
import { colors, radii, spacing, typography, elevation } from '../../theme/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Journal'>,
  NativeStackScreenProps<RootStackParamList>
>;

type FeedKind = 'journal' | 'morning' | 'midday' | 'evening' | 'windDown';

interface FeedItem {
  id: string;
  kind: FeedKind;
  text: string;
  timestamp: string;
  isPrayer?: boolean;
}

export function JournalScreen({ navigation }: Props) {
  const {
    profile,
    journalEntries,
    dailyEntries,
    middayEntries,
    eveningEntries,
    windDownEntries,
    addJournalEntry,
    errorMessage,
    clearErrorMessage,
  } = useApp();
  const [draft, setDraft] = useState('');
  const [isPrayerDraft, setIsPrayerDraft] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const feed = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = [];

    for (const entry of journalEntries) {
      items.push({ id: entry.id, kind: 'journal', text: entry.text, timestamp: entry.createdAt, isPrayer: entry.isPrayer });
    }
    for (const entry of Object.values(dailyEntries)) {
      if (entry.focus) {
        items.push({ id: `morning-${entry.date}`, kind: 'morning', text: entry.focus, timestamp: entry.completedAt });
      }
    }
    for (const entry of Object.values(middayEntries)) {
      if (entry.note) {
        items.push({ id: `midday-${entry.date}`, kind: 'midday', text: entry.note, timestamp: entry.completedAt });
      }
    }
    for (const entry of Object.values(eveningEntries)) {
      const parts = [entry.highlight, entry.gratitude, entry.challenge, entry.note].filter(Boolean);
      if (parts.length > 0) {
        items.push({ id: `evening-${entry.date}`, kind: 'evening', text: parts.join(' '), timestamp: entry.completedAt });
      }
    }
    for (const entry of Object.values(windDownEntries)) {
      if (entry.note) {
        items.push({ id: `windDown-${entry.date}`, kind: 'windDown', text: entry.note, timestamp: entry.completedAt });
      }
    }

    return items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }, [journalEntries, dailyEntries, middayEntries, eveningEntries, windDownEntries]);

  const isFirstEverUse = feed.length === 0;
  const showPrayerToggle = profile.faithPreference === 'yes';

  async function handleSave() {
    const text = draft.trim();
    if (!text) return;
    setIsSaving(true);
    await addJournalEntry(text, showPrayerToggle && isPrayerDraft ? true : undefined);
    setIsSaving(false);
    setDraft('');
    setIsPrayerDraft(false);
  }

  function handleRetry() {
    clearErrorMessage();
    handleSave();
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Journal
          </Text>
          <Text style={styles.subtitle}>Reflection and free writing, whenever you'd like.</Text>
        </View>

        {errorMessage ? <InlineNotice message={errorMessage} onRetry={handleRetry} /> : null}

        <View style={[styles.composer, elevation.soft]}>
          <TextInput
            style={styles.composerInput}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textTertiary}
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={2000}
          />
          {showPrayerToggle ? (
            <Pressable
              onPress={() => setIsPrayerDraft((v) => !v)}
              style={styles.prayerToggleRow}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isPrayerDraft }}
            >
              <View style={[styles.prayerCheck, isPrayerDraft && styles.prayerCheckOn]}>
                {isPrayerDraft ? <Text style={styles.prayerCheckGlyph}>✓</Text> : null}
              </View>
              <Text style={styles.prayerToggleLabel}>This is a prayer</Text>
            </Pressable>
          ) : null}
          <PrimaryButton
            label="Save"
            onPress={handleSave}
            disabled={draft.trim().length === 0}
            loading={isSaving}
            style={styles.saveButton}
          />
          {isFirstEverUse ? <Text style={styles.trustLine}>Private by design.</Text> : null}
        </View>

        {feed.length > 0 ? (
          <View style={styles.feed}>
            {feed.map((item) => (
              <PageTurn key={item.id}>
                <View style={styles.entryCard}>
                  {item.isPrayer ? <Text style={styles.entryEyebrow}>Prayer</Text> : null}
                  <Text style={styles.entryText}>{item.text}</Text>
                </View>
              </PageTurn>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Your reflections will settle here as you write.</Text>
        )}

        <Pressable onPress={() => navigation.navigate('ArchivedJourney')} style={styles.archivedLink} hitSlop={8}>
          <Text style={styles.archivedLinkText}>Archived Journey</Text>
        </Pressable>
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
  title: {
    ...typography.display,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMuted,
  },
  composer: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  composerInput: {
    ...typography.quote,
    fontStyle: 'italic',
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  prayerToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prayerCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerCheckOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  prayerCheckGlyph: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  prayerToggleLabel: {
    ...typography.bodyMuted,
  },
  saveButton: {
    marginTop: spacing.xs,
  },
  trustLine: {
    ...typography.caption,
    textAlign: 'center',
  },
  feed: {
    gap: spacing.md,
  },
  entryCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  entryEyebrow: {
    ...typography.label,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  entryText: {
    ...typography.body,
  },
  emptyText: {
    ...typography.bodyMuted,
    textAlign: 'center',
  },
  archivedLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  archivedLinkText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
