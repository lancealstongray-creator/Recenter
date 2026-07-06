import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { motion } from '../theme/theme';
import { useReducedMotion } from '../utils/motion';

interface Props {
  children: React.ReactNode;
}

// A subtle horizontal settle (translateX + opacity) evoking a page
// closing, reserved for Journal entries and Archived Journey rows
// appearing — Arrival Mark keeps its one exclusive meaning ("you
// completed a session"), so reflection/memory moments get their own
// signature instead of borrowing Today's.
export function PageTurn({ children }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const duration = reducedMotion ? motion.pageTurn.duration / 2 : motion.pageTurn.duration;
    translateX.setValue(reducedMotion ? 0 : motion.pageTurn.translateX);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        easing: Easing.bezier(...motion.easing.arrive),
        useNativeDriver: true,
      }),
    ]).start();
    // Mount-only reveal, not a response to prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Animated.View style={{ opacity, transform: [{ translateX }] }}>{children}</Animated.View>;
}
