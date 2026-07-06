import React, { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PageTurn } from '../../components/PageTurn';
import { getMood } from '../../constants/moods';
import { getLifeArea } from '../../constants/lifeAreas';
import { formatFriendlyDate, formatSeasonLabel, monthsSince } from '../../utils/date';
import { DailyRecenterEntry, EveningReflectionEntry } from '../../types';
import { colors, radii, spacing, typography, elevation } from '../../theme/theme';

interface DayRow {
  date: string;
  daily?: DailyRecenterEntry;
  evening?: EveningReflectionEntry;
}

interface Section {
  title: string;
  data: DayRow[];
}

// Archived Journey reframes this same data with the opposite emotional
// register from Today/Journal: perspective and memory, not tracking. No
// numeric tallies anywhere — a representative excerpt per life area
// instead, and grouped by season rather than calendar month.
export function HistoryScreen() {
  const { dailyEntries, eveningEntries } = useApp();

  const { sections, totalDays, earliestDate, topAreaExcerpts } = useMemo(() => {
    const dates = new Set<string>([...Object.keys(dailyEntries), ...Object.keys(eveningEntries)]);
    const sortedDates = Array.from(dates).sort((a, b) => (a < b ? 1 : -1));
    const rows: DayRow[] = sortedDates.map((date) => ({ date, daily: dailyEntries[date], evening: eveningEntries[date] }));

    const grouped = new Map<string, DayRow[]>();
    for (const row of rows) {
      const seasonLabel = formatSeasonLabel(row.date);
      if (!grouped.has(seasonLabel)) grouped.set(seasonLabel, []);
      grouped.get(seasonLabel)!.push(row);
    }
    const sections: Section[] = Array.from(grouped.entries()).map(([title, data]) => ({ title, data }));

    // One representative excerpt per life area (most recent focus for
    // that area, since focus is the only reflection text tied to it),
    // never a count.
    const excerptByArea = new Map<string, { date: string; excerpt: string }>();
    for (const entry of Object.values(dailyEntries)) {
      if (!entry.focus) continue;
      const existing = excerptByArea.get(entry.lifeAreaId);
      if (!existing || entry.date > existing.date) {
        excerptByArea.set(entry.lifeAreaId, { date: entry.date, excerpt: entry.focus });
      }
    }
    const topAreaExcerpts = Array.from(excerptByArea.entries())
      .map(([id, { excerpt }]) => ({ area: getLifeArea(id), excerpt }))
      .filter((x) => x.area)
      .slice(0, 3);

    const earliestDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;

    return { sections, totalDays: rows.length, earliestDate, topAreaExcerpts };
  }, [dailyEntries, eveningEntries]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Archived Journey
        </Text>
        {earliestDate ? (
          <Text style={styles.subtitle}>You've been reflecting for {monthsSince(earliestDate)}.</Text>
        ) : (
          <Text style={styles.subtitle}>A quiet record of the moments you've shown up for yourself.</Text>
        )}
      </View>

      {totalDays > 0 && topAreaExcerpts.length > 0 ? (
        <View style={[styles.summaryCard, elevation.soft]}>
          {topAreaExcerpts.map(({ area, excerpt }) => (
            <Text key={area!.id} style={styles.areaExcerpt}>
              {area!.icon} {area!.label} — "{excerpt}"
            </Text>
          ))}
        </View>
      ) : null}

      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your journey will grow here as you Recenter each day.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.date}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          renderItem={({ item }) => (
            <PageTurn>
              <HistoryRow row={item} />
            </PageTurn>
          )}
        />
      )}
    </ScreenContainer>
  );
}

function HistoryRow({ row }: { row: DayRow }) {
  const mood = row.daily ? getMood(row.daily.moodId) : undefined;
  const lifeArea = row.daily ? getLifeArea(row.daily.lifeAreaId) : undefined;

  return (
    <View style={[styles.row, elevation.soft]}>
      <Text style={styles.rowDate}>{formatFriendlyDate(row.date)}</Text>
      {row.daily ? (
        <View style={styles.rowSection}>
          <Text style={styles.rowFocus}>{row.daily.focus}</Text>
          <Text style={styles.rowMeta}>
            {mood ? `${mood.icon} ${mood.label}` : ''}
            {lifeArea ? `  ·  ${lifeArea.icon} ${lifeArea.label}` : ''}
          </Text>
        </View>
      ) : null}
      {row.evening ? (
        <View style={styles.rowSection}>
          <Text style={styles.rowMeta}>Evening: {row.evening.highlight}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.display,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.quote,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  areaExcerpt: {
    ...typography.bodyMuted,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    ...typography.label,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  rowDate: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  rowSection: {
    marginBottom: spacing.sm,
  },
  rowFocus: {
    ...typography.body,
    fontWeight: '500',
  },
  rowMeta: {
    ...typography.bodyMuted,
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    ...typography.bodyMuted,
    textAlign: 'center',
    maxWidth: 260,
  },
});
