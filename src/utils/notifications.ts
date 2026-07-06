import { Platform } from 'react-native';

// Requests OS notification permission. Only ever called after the user
// has explicitly chosen a reminder preference — never on launch, never
// silently. Guarded so an unsupported platform (e.g. web) never crashes
// onboarding.
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    const Notifications = await import('expo-notifications');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}
