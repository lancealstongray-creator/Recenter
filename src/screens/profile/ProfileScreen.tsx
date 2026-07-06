import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectChip } from '../../components/SelectChip';
import { SelectionCard } from '../../components/SelectionCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { LIFE_AREAS } from '../../constants/lifeAreas';
import { FAITH_PREFERENCES } from '../../constants/faithPreferences';
import { FaithPreference } from '../../types';
import { colors, radii, spacing, typography, elevation } from '../../theme/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: Props) {
  const { profile, updateProfile, resetAllData } = useApp();
  const [name, setName] = useState(profile.name);

  function toggleArea(id: string) {
    const has = profile.lifeAreaIds.includes(id);
    const next = has ? profile.lifeAreaIds.filter((x) => x !== id) : [...profile.lifeAreaIds, id];
    updateProfile({ lifeAreaIds: next });
  }

  function selectFaithPreference(id: Exclude<FaithPreference, null>) {
    updateProfile({ faithPreference: id });
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

        <View style={[styles.card, elevation.soft]}>
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

        <View style={[styles.card, elevation.soft]}>
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

        <View style={[styles.card, elevation.soft]}>
          <Text style={styles.cardLabel}>Faith-based encouragement</Text>
          <View style={styles.list}>
            {FAITH_PREFERENCES.map((option) => (
              <SelectionCard
                key={option.id}
                title={option.label}
                selected={profile.faithPreference === option.id}
                onPress={() => selectFaithPreference(option.id)}
              />
            ))}
          </View>
        </View>

        <View style={[styles.card, elevation.soft]}>
          <Text style={styles.cardLabel}>About Recenter</Text>
          <Text style={styles.aboutText}>
            Recenter is a quiet daily practice — never a performance. There are no streaks, no
            badges, and no reminders about days you missed. Just a space to reconnect with what
            matters, whenever you're ready.
          </Text>
          <Text style={[styles.aboutText, styles.trustLine]}>
            Your reflections stay on this device. We designed Recenter this way on purpose.
          </Text>
        </View>

        <View style={[styles.card, elevation.soft]}>
          <Text style={styles.cardLabel}>Help</Text>
          <Text style={styles.aboutText}>Take a quick, optional look around the app.</Text>
          <PrimaryButton
            label="Take the app tour"
            variant="secondary"
            onPress={() => navigation.navigate('Tour')}
            style={styles.tourButton}
          />
        </View>

        <Pressable
          onPress={() => navigation.navigate('ArchivedJourney')}
          style={styles.archivedLink}
          hitSlop={8}
        >
          <Text style={styles.archivedLinkText}>Archived Journey</Text>
        </Pressable>

        <View style={styles.resetZone}>
          <PrimaryButton label="Reset my data" variant="secondary" onPress={handleReset} />
        </View>
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
  list: {
    gap: spacing.md,
  },
  aboutText: {
    ...typography.bodyMuted,
  },
  trustLine: {
    marginTop: spacing.md,
  },
  tourButton: {
    marginTop: spacing.md,
  },
  archivedLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  archivedLinkText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  resetZone: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
