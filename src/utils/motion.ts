import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';
import { motion } from '../theme/theme';

// Every animation in the app branches on this: reduced motion gets
// opacity-only, halved duration, zero translate/scale — never fully
// disabled, just quieted.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduced(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setReduced(enabled);
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}

// Every tap yields — a soft scale, never a flat color slam. Shared by
// PrimaryButton, SelectChip, and SelectionCard so the feel is identical
// everywhere something is pressed.
export function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  function onPressIn() {
    if (reducedMotion) return;
    Animated.timing(scale, {
      toValue: 0.97,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }

  function onPressOut() {
    if (reducedMotion) return;
    Animated.timing(scale, {
      toValue: 1,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }

  return { scale, onPressIn, onPressOut };
}
