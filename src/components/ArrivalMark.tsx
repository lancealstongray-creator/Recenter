import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { colors, motion, spacing } from '../theme/theme';
import { useReducedMotion } from '../utils/motion';

interface Props {
  children: React.ReactNode;
}

// The signature "you're done" moment: scale 0.85→1 + fade, arrive easing,
// slow duration. No bounce, no overshoot.
export function ArrivalMark({ children }: Props) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const duration = reducedMotion ? motion.duration.base / 2 : motion.duration.slow;
    scale.setValue(reducedMotion ? 1 : 0.85);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration,
        easing: Easing.bezier(...motion.easing.arrive),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Animated.View style={[styles.mark, { opacity, transform: [{ scale }] }]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  mark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
});
