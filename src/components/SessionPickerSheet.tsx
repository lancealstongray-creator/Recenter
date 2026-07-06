import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SESSION_ORDER, SESSION_META } from '../constants/sessionTypes';
import { SessionType } from '../types';
import { colors, radii, spacing, typography } from '../theme/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: SessionType) => void;
}

// A plain user choice, not a recommendation list — no ranking, no
// scoring, no "best for you" copy. Opens from Today's "Or choose
// something else" link.
export function SessionPickerSheet({ visible, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Choose a session</Text>
        {SESSION_ORDER.map((type) => (
          <Pressable
            key={type}
            style={styles.row}
            onPress={() => {
              onSelect(type);
              onClose();
            }}
            accessibilityRole="button"
            accessibilityLabel={SESSION_META[type].label}
          >
            <View style={styles.rowIcon}>
              <Ionicons name={SESSION_META[type].icon as never} size={20} color={colors.accentDark} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{SESSION_META[type].label}</Text>
              <Text style={styles.rowBlurb}>{SESSION_META[type].blurb}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    // colors.textPrimary at ~30% opacity (8-digit hex alpha) — reuses
    // the existing token instead of a separate hand-picked rgba value.
    backgroundColor: `${colors.textPrimary}4D`,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.label,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  rowBlurb: {
    ...typography.bodyMuted,
    fontSize: 14,
  },
});
