import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import Alternative from "../components/Alternative";
import KanjiComps from "../components/KanjiComps";
import { shuffle } from "../functions/shuffle";
import { ChallengeContext } from "../contexts/ChallengeContextProvider";
import KanjiMeaning from "../displays/KanjiMeaning";
import Button from "../components/Button";

type Props = {};

/** The general challenge view for building a kanji through components */
const CompKanjiChallenge: FC<Props> = ({}) => {
  const { setGlyph, isFinished, glyphInfo, challengeId } =
    useContext(ChallengeContext);
  const [alts, setAlts] = useState<string[]>([]);

  useEffect(() => {
    setGlyph?.();
  }, []);

  useEffect(() => {
    if (isFinished) success.start();
    else {
      builderScale.setValue(1);
      kanjiScale.setValue(0.5);
      opacity.setValue(1);
      continueTranslateY.setValue(200);
      success.reset();
    }
  }, [isFinished]);

  const position = glyphInfo?.comps.position;

  useEffect(() => {
    const order = glyphInfo?.comps.order ?? [];
    setAlts(
      shuffle(
        order.concat(
          shuffle(["あ", "べ", "ぜ", "で", "え", "ふ", "ぐ", "へ"]).filter(
            (_, i) => i < 8 - order.length
          )
        )
      )
    );
  }, [glyphInfo?.comps.order]);

  const builderScale = useRef(new Animated.Value(1)).current;
  const kanjiScale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const continueTranslateY = useRef(new Animated.Value(200)).current;
  // const borderWidth = useRef(new Animated.Value(0)).current;

  const success = Animated.sequence([
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

  // px-9
  return (
    <Animated.View
      // style={{ borderWidth: isFinished ? 8 : 0 }}
      className={
        "flex-col items-center pt-20   w-full h-full flex-grow  border-forest-500 rounded-[44px] "
      }
    >
      <View className="flex-grow" />
      <View className="w-1/2 h-auto aspect-square ">
        <Animated.View
          style={{
            gap: 12,
            opacity: opacity,
            transform: [{ scale: builderScale }],
          }}
          className="flex-grow"
          children={<KanjiComps pos={position} key={challengeId} />}
        />
        <Animated.View
          style={{
            opacity: Animated.subtract(1, opacity),
            transform: [{ scale: kanjiScale }],
          }}
          className=" bg-forest-200 border-forest-900 border-4 absolute w-full h-full flex-grow flex-shrink rounded-xl items-center justify-center leading-none  align-text-bottom	"
        >
          <Text
            style={{ fontFamily: "KleeOne_600SemiBold" }}
            className="text-8xl p-2 -mb-6"
            adjustsFontSizeToFit
          >
            {glyphInfo?.glyph}
          </Text>
        </Animated.View>
      </View>
      <KanjiMeaning text={glyphInfo?.meanings.primary ?? ""} />
      <View className="flex-grow" />
      <View className="flex-grow" />
      <View
        style={{ gap: 12 }}
        className="flex-row max-w-full flex-shrink flex-wrap h-auto px-9"
      >
        {alts.map((alt, i) => (
          <Alternative
            key={i + alt + challengeId} // TODO make unique per challenge
            text={alt}
            dragOpacity={
              glyphInfo?.comps.order.includes(alt) ? opacity : undefined
            }
            dragScale={
              glyphInfo?.comps.order.includes(alt) ? builderScale : undefined
            }
          />
        ))}
      </View>
      <Animated.View
        style={{
          aspectRatio: "20 / 7",
          transform: [{ translateY: continueTranslateY }],
        }}
        className=" bg-forest-500 w-full h-auto py-6  mt-4"
      >
        <View className="px-8 h-20 ">
          <Button
            text="Continue"
            onPress={() => {
              setGlyph?.();
            }}
          />
        </View>
        {/* Hacky bottom bar that does not take up any real space. To ensure the spring animation does not show white at the bottom. */}
        <View
          className="absolute h-40 bg-forest-500 w-full bottom-0 -z-10"
          style={{
            transform: [{ translateY: 150 }],
          }}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default CompKanjiChallenge;
