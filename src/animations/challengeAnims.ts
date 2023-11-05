import { useRef, useState } from "react";
import { Animated } from "react-native";

export const useChallengeAnims = () => {
  const builderScale = useRef(new Animated.Value(1)).current;
  const kanjiScale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const continueTranslateY = useRef(new Animated.Value(200)).current;
  // const borderWidth = useRef(new Animated.Value(0)).current;

  const animation = Animated.sequence([
    // Lift (scale up) linear 150ms
    Animated.timing(builderScale, {
      toValue: 1.2,
      duration: 150,
      useNativeDriver: true,
    }),
    // Scale down builder, scale up kanji, spring, 700ms
    Animated.parallel([
      Animated.spring(opacity, {
        toValue: 0,
        stiffness: 236.9,
        damping: 17.14,
        mass: 1,
        useNativeDriver: true,
      }),
      Animated.spring(builderScale, {
        toValue: 0.5,
        stiffness: 236.9,
        damping: 17.14,
        mass: 1,
        useNativeDriver: true,
      }),
      Animated.spring(kanjiScale, {
        toValue: 1,
        stiffness: 236.9,
        damping: 17.14,
        mass: 1,
        useNativeDriver: true,
      }),
      Animated.spring(continueTranslateY, {
        toValue: 0,
        stiffness: 236.9,
        damping: 17.14,
        mass: 1,
        useNativeDriver: true,
      }),
    ]),
  ]); // start the sequence group
  return { animation, builderScale, kanjiScale, opacity, continueTranslateY };
};
