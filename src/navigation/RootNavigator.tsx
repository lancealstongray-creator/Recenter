import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { DailyRecenterScreen } from '../screens/dailyRecenter/DailyRecenterScreen';
import { EveningReflectionScreen } from '../screens/eveningReflection/EveningReflectionScreen';
import { TourScreen } from '../screens/tour/TourScreen';
import { useApp } from '../context/AppContext';
import { colors, motion } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoadingMark() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: motion.duration.slow,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.mark, { opacity }]}>
        <Ionicons name="sunny-outline" size={28} color={colors.accentDark} />
      </Animated.View>
    </View>
  );
}

export function RootNavigator() {
  const { isLoading, profile, justOnboarded } = useApp();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  // The moment onboarding finishes, drop straight into the user's real
  // first Morning Session — never a simulated tutorial, never a separate
  // celebration screen. Finishing that session returns to Home as usual.
  useEffect(() => {
    // DailyRecenterScreen captures `justOnboarded` itself at mount (to know
    // this is the real first session) and clears it once consumed — so we
    // only trigger the navigation here, not the clear.
    if (justOnboarded && navigationRef.isReady()) {
      navigationRef.navigate('DailyRecenter');
    }
  }, [justOnboarded, navigationRef]);

  if (isLoading) {
    return <LoadingMark />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!profile.onboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
        <Stack.Screen
          name="DailyRecenter"
          component={DailyRecenterScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="EveningReflection"
          component={EveningReflectionScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Tour"
          component={TourScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
