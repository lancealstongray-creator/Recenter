import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { motion } from '../theme/theme';

interface Props {
  stepKey: string | number;
  children: React.ReactNode;
}

// Fades content in whenever `stepKey` changes — the only motion in the
// step-based flows (onboarding, Daily Recenter, Evening Reflection).
export function StepFade({ stepKey, children }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: motion.duration.base,
      useNativeDriver: true,
    }).start();
  }, [stepKey, opacity]);

  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}
