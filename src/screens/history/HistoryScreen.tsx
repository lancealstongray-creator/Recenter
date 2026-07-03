import React, { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { getMood } from '../../constants/moods';
import { getLifeArea } from '../../constants/lifeAreas';
import { formatFriendlyDate, formatMonthLabel } from '../../utils/date';
import { DailyRecenterEntry, EveningReflectionEntry } from '../../types';
import { colors, radii, spacing, typography, shadow } from '../../theme/theme';

interface DayRow {
  date: string;
  daily?: DailyRecenterEntry;
  evening?: EveningReflectionEntry;
}

interface Section {
  title: string;
  data: DayRow[];
}

export function HistoryScreen() {
  const { dailyEntries, eveningEntries } = useApp();

  const { sections, totalDays, topAreas } = useMemo(() => {
    const dates = new Set<string>([...Object.keys(dailyEntries), ...Object.keys(eveningEntries)]);
    const rows: DayRow[] = Array.from(dates)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((date) => ({ date, daily: dailyEntries[date], evening: eveningEntries[date] }));

    const grouped = new Map<string, DayRow[]>();
    for (const row of rows) {
      const monthLabel = formatMonthLabel(row.date);
      if (!grouped.has(monthLabel)) grouped.set(monthLabel, []);
      grouped.get(monthLabel)!.push(row);
    }
    const sections: Section[] = Array.from(grouped.entries()).map(([title, data]) => ({ title, data }));

    const areaCounts = new Map<string, number>();
    Object.values(dailyEntries).forEach((entry) => {
      areaCounts.set(entry.lifeAreaId, (areaCounts.get(entry.lifeAreaId) ?? 0) + 1);
    });
    const topAreas = Array.from(areaCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => ({ area: getLifeArea(id), count }))
      .filter((x) => x.area);

    return { sections, totalDays: rows.length, topAreas };
  }, [dailyEntries, eveningEntries]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Your History
        </Text>
        <Text style={styles.subtitle}>A record of the moments you've chosen to show up for yourself.</Text>
      </View>

      {totalDays > 0 ? (
        <View style={[styles.summaryCard, shadow.soft]}>
          <Text style={styles.summaryHeadline}>
            You've recentered {totalDays} {totalDays === 1 ? 'day' : 'days'}.
          </Text>
          {topAreas.length > 0 ? (
            <View style={styles.areaRow}>
              {topAreas.map(({ area, count }) => (
                <View key={area!.id} style={styles.areaChip}>
                  <Text style={styles.areaChipText}>
                    {area!.icon} {area!.label} · {count}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your history will grow here as you Recenter each day.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.date}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          renderItem={({ item }) => <HistoryRow row={item} />}
        />
      )}
    </ScreenContainer>
  );
}

function HistoryRow({ row }: { row: DayRow }) {
  const mood = row.daily ? getMood(row.daily.moodId) : undefined;
  const lifeArea = row.daily ? getLifeArea(row.daily.lifeAreaId) : undefined;

  return (
    <View style={[styles.row, shadow.soft]}>
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
    ...typography.bodyMuted,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  summaryHeadline: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  areaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  areaChip: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  areaChipText: {
    color: colors.accentDark,
    fontSize: 13,
    fontWeight: '500',
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
    marginBottom: spacing.xs,
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
