import React, { FC, useContext, useEffect } from "react";
import { View, Text, Animated } from "react-native";
import KanjiComps from "../components/KanjiComps";
import { GetGlyphContext } from "../contexts/ChallengeContextProvider";
import KanjiMeaning from "../displays/KanjiMeaning";
import { useWindowDimensions } from "react-native";
import HealthBar from "../components/HealthBar";
import StatusBar from "../components/StatusBar";
import Alternative from "../components/Alternative";
import { useChallengeAnims } from "../animations/challengeAnims";
import BottomBar from "../components/BottomBar";
import {
  SetChallengeContext,
  ExpectedChoiceContext,
  SeenCountContext,
  ChoicesContext,
} from "../contexts/ChallengeContextProvider";

/** The general challenge view for building a kanji through components */
const CompKanjiChallenge: FC<{}> = ({}) => {
  // console.log("CHALLENGE UPDATE");

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { animation, builderScale, continueTranslateY, kanjiScale, opacity } =
    useChallengeAnims();

  const setChallenge = useContext(SetChallengeContext);
  const expectedChoice = useContext(ExpectedChoiceContext);
  const getGlyph = useContext(GetGlyphContext);
  const seenCount = useContext(SeenCountContext);
  const choices = useContext(ChoicesContext);

  useEffect(() => {
    setChallenge?.();
  }, []);

  useEffect(() => {
    if (expectedChoice === "FINISH") animation.start();
    else {
      builderScale.setValue(1);
      kanjiScale.setValue(0.5);
      opacity.setValue(1);
      continueTranslateY.setValue(200);
      animation.reset();
    }
  }, [expectedChoice]);

  const glyphInfo = getGlyph?.();
  const position = glyphInfo?.comps.position;
  const margin = 36 * 2;
  const gap = 3 * 12;
  const altWidth = (windowWidth - margin - gap) / 4;

  return (
    <Animated.View className="flex-col items-center pt-20   w-full h-full flex-grow  border-forest-500 rounded-[44px] ">
      <HealthBar altWidth={altWidth} />
      <StatusBar />
      <View className="w-2/4  h-auto aspect-square  flex-shrink flex-grow">
        <Animated.View
          style={{
            gap: 12,
            opacity: opacity,
            transform: [{ scale: builderScale }],
          }}
          className="flex-grow"
        >
          <KanjiComps pos={position} key={seenCount} />
        </Animated.View>
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
            {getGlyph?.()?.glyph}
          </Text>
        </Animated.View>
      </View>
      <KanjiMeaning text={glyphInfo?.meanings.primary ?? ""} />
      <View style={{ flexGrow: 2 }} />
      <View
        style={{ gap: 12 }}
        className="flex-row max-w-full flex-shrink flex-wrap h-auto px-9"
      >
        {choices?.map((alt, i) => {
          const isCorrectAnswer = glyphInfo?.comps.order.includes(alt.glyph!);
          return (
            <Alternative
              key={i + alt.glyph! + seenCount}
              altInfo={alt}
              dragOpacity={isCorrectAnswer ? opacity : undefined}
              dragScale={isCorrectAnswer ? builderScale : undefined}
              width={altWidth}
              expectedChoice={expectedChoice}
            />
          );
        })}
      </View>
      <BottomBar
        onContinue={() => setChallenge?.()}
        yOffset={continueTranslateY}
        altWidth={altWidth}
      />
    </Animated.View>
  );
};

export default CompKanjiChallenge;
