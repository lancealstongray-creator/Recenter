import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectChip } from '../../components/SelectChip';
import { PrimaryButton } from '../../components/PrimaryButton';
import { LIFE_AREAS } from '../../constants/lifeAreas';
import { colors, radii, spacing, typography, shadow } from '../../theme/theme';

export function ProfileScreen() {
  const { profile, updateProfile, resetAllData } = useApp();
  const [name, setName] = useState(profile.name);

  function toggleArea(id: string) {
    const has = profile.lifeAreaIds.includes(id);
    const next = has ? profile.lifeAreaIds.filter((x) => x !== id) : [...profile.lifeAreaIds, id];
    updateProfile({ lifeAreaIds: next });
  }

  function handleNameBlur() {
    if (name.trim() !== profile.name) {
      updateProfile({ name: name.trim() });
    }
  }

  function handleReset() {
    Alert.alert(
      'Reset your data?',
      'This clears your entries and preferences from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetAllData() },
      ]
    );
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Profile
          </Text>
        </View>

        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.cardLabel}>Your name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            onBlur={handleNameBlur}
            placeholder="Add your name"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.cardLabel}>Life areas that matter to you</Text>
          <View style={styles.wrap}>
            {LIFE_AREAS.map((area) => (
              <SelectChip
                key={area.id}
                label={area.label}
                icon={area.icon}
                selected={profile.lifeAreaIds.includes(area.id)}
                onPress={() => toggleArea(area.id)}
              />
            ))}
          </View>
        </View>

        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.cardLabel}>About Recenter</Text>
          <Text style={styles.aboutText}>
            Recenter is a quiet daily practice — never a performance. There are no streaks, no
            badges, and no reminders about days you missed. Just a space to reconnect with what
            matters, whenever you're ready.
          </Text>
        </View>

        <PrimaryButton label="Reset my data" variant="secondary" onPress={handleReset} style={styles.resetButton} />
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
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  cardLabel: {
    ...typography.label,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  aboutText: {
    ...typography.bodyMuted,
  },
  resetButton: {
    marginTop: spacing.xs,
  },
});
