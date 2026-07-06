import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { motion } from '../theme/theme';
import { useReducedMotion } from '../utils/motion';

interface Props {
  children: React.ReactNode;
}

// Fades + drifts content in once, on mount only — never on an incidental
// re-render. Used for Home's conditional cards so a newly-arrived state
// (today's focus appearing, the resting message showing up) reads as
// something new, without ever feeling jumpy while scrolling.
export function QuietReveal({ children }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const duration = reducedMotion ? motion.duration.base / 2 : motion.duration.base;
    translateY.setValue(reducedMotion ? 0 : 8);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        easing: Easing.bezier(...motion.easing.settle),
        useNativeDriver: true,
      }),
    ]).start();
    // Intentionally runs once — this is a mount-only reveal, not a
    // response to prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
}
