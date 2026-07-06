// Global test setup. Keeps AsyncStorage in-memory and isolated per test
// file so storage/context tests never touch real device state.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest')
);
