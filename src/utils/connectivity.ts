import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Recenter has no backend and no network dependency at all — nothing
// here ever blocks a feature. This exists only to show a reassuring,
// non-alarming notice when the browser reports itself offline (web
// only; native has no equivalent built-in signal without an extra
// native module, so it always reports online there).
export function useIsOffline(): boolean {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined' || typeof window === 'undefined') {
      return;
    }
    setIsOffline(!navigator.onLine);
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return isOffline;
}
