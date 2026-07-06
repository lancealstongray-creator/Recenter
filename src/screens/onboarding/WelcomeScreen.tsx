import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.mark}>
          <Ionicons name="sunny-outline" size={28} color={colors.accentDark} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Recenter
        </Text>
        <Text style={styles.subtitle}>Reconnect with what matters most, one day at a time.</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Begin" onPress={() => navigation.navigate('Philosophy')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  title: {
    ...typography.hero,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.quote,
    textAlign: 'center',
    maxWidth: 280,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
