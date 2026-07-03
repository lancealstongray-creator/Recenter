import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import { OnboardingDraftProvider } from '../context/OnboardingDraftContext';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { PhilosophyScreen } from '../screens/onboarding/PhilosophyScreen';
import { HowDailyRecenterWorksScreen } from '../screens/onboarding/HowDailyRecenterWorksScreen';
import { HowEveningReflectionWorksScreen } from '../screens/onboarding/HowEveningReflectionWorksScreen';
import { ChooseLifeAreasScreen } from '../screens/onboarding/ChooseLifeAreasScreen';
import { YourNameScreen } from '../screens/onboarding/YourNameScreen';
import { ReadyScreen } from '../screens/onboarding/ReadyScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <OnboardingDraftProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Philosophy" component={PhilosophyScreen} />
        <Stack.Screen name="HowDailyRecenterWorks" component={HowDailyRecenterWorksScreen} />
        <Stack.Screen name="HowEveningReflectionWorks" component={HowEveningReflectionWorksScreen} />
        <Stack.Screen name="ChooseLifeAreas" component={ChooseLifeAreasScreen} />
        <Stack.Screen name="YourName" component={YourNameScreen} />
        <Stack.Screen name="Ready" component={ReadyScreen} />
      </Stack.Navigator>
    </OnboardingDraftProvider>
  );
}
