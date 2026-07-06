import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ONBOARDING_STEPS, OnboardingStackParamList } from './types';
import { useApp } from '../context/AppContext';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { WhatIsRecenterScreen } from '../screens/onboarding/WhatIsRecenterScreen';
import { ChooseLifeAreasScreen } from '../screens/onboarding/ChooseLifeAreasScreen';
import { FaithPreferenceScreen } from '../screens/onboarding/FaithPreferenceScreen';
import { OneFocusSetupScreen } from '../screens/onboarding/OneFocusSetupScreen';
import { NotificationsScreen } from '../screens/onboarding/NotificationsScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const { profile } = useApp();
  // Resume an interrupted onboarding at the last completed screen rather
  // than starting over.
  const initialRouteName = ONBOARDING_STEPS[profile.onboardingStep] ?? ONBOARDING_STEPS[0];

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WhatIsRecenter" component={WhatIsRecenterScreen} />
      <Stack.Screen name="ChooseLifeAreas" component={ChooseLifeAreasScreen} />
      <Stack.Screen name="FaithPreference" component={FaithPreferenceScreen} />
      <Stack.Screen name="OneFocusSetup" component={OneFocusSetupScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
