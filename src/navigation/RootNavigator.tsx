import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { DailyRecenterScreen } from '../screens/dailyRecenter/DailyRecenterScreen';
import { EveningReflectionScreen } from '../screens/eveningReflection/EveningReflectionScreen';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isLoading, profile, justOnboarded, clearJustOnboarded } = useApp();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  // The moment onboarding finishes, drop straight into the user's real
  // first Morning Session — never a simulated tutorial, never a separate
  // celebration screen. Finishing that session returns to Home as usual.
  useEffect(() => {
    if (justOnboarded && navigationRef.isReady()) {
      navigationRef.navigate('DailyRecenter');
      clearJustOnboarded();
    }
  }, [justOnboarded, navigationRef, clearJustOnboarded]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
