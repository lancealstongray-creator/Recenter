import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { JournalScreen } from '../screens/journal/JournalScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { colors, spacing } from '../theme/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconName = keyof typeof Ionicons.glyphMap;

const ICONS: Record<keyof MainTabParamList, { outline: IoniconName; filled: IoniconName }> = {
  Home: { outline: 'home-outline', filled: 'home' },
  Journal: { outline: 'book-outline', filled: 'book' },
  Profile: { outline: 'person-outline', filled: 'person' },
};

// Outline↔filled swap cross-fades over 100ms instead of switching
// instantly — a small softening consistent with the rest of the app's
// motion language.
function TabIcon({ name, focused, color }: { name: keyof MainTabParamList; focused: boolean; color: string }) {
  const filledOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(filledOpacity, {
      toValue: focused ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [focused, filledOpacity]);

  return (
    <>
      <Ionicons name={ICONS[name].outline} size={22} color={color} />
      <Animated.View style={{ position: 'absolute', opacity: filledOpacity }}>
        <Ionicons name={ICONS[name].filled} size={22} color={color} />
      </Animated.View>
    </>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accentDark,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
        tabBarIcon: ({ color, focused }) => <TabIcon name={route.name} focused={focused} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
