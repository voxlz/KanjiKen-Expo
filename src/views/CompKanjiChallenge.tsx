import React, { FC, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import Alternative from "../components/Alternative";
import KanjiComps from "../components/KanjiComps";
import { glyphDict } from "../data_loading/glyphDict";
import { shuffle } from "../functions/shuffle";
import { ChallengeContext } from "../contexts/ChallengeContextProvider";
import KanjiMeaning from "../displays/KanjiMeaning";

type Props = {};

/** The general challenge view for building a kanji through components */
const CompKanjiChallenge: FC<Props> = ({}) => {
  const { setGlyph } = useContext(ChallengeContext);
  const [alts, setAlts] = useState<string[]>([]);
  const gd = glyphDict();
  const glyphInfo = gd["食"];

  useEffect(() => {
    setGlyph?.(glyphInfo);
  }, []);

  const order = glyphInfo.comps.order;
  const position = glyphInfo.comps.position;
  const meaning = glyphInfo.meanings.primary;

  useEffect(() => {
    setAlts(
      shuffle(
        order.concat(
          shuffle(["あ", "べ", "ぜ", "で", "え", "ふ", "ぐ", "へ"]).filter(
            (_, i) => i < 8 - order.length
          )
        )
      )
    );
  }, []);

  return (
    <View className="flex-col items-center py-20 px-9 gap-y-3 w-full h-full flex-grow">
      <View className="flex-grow" />
      <View style={{ gap: 12 }} className="w-1/2 h-auto aspect-square">
        <KanjiComps pos={position} />
      </View>
      <KanjiMeaning text={meaning} />
      <View className="flex-grow" />
      <View className="flex-grow" />
      <View
        style={{ gap: 12 }}
        className="flex-row max-w-full flex-shrink flex-wrap "
      >
        {alts.map((alt, i) => (
          <Alternative text={alt} key={i} />
        ))}
      </View>
    </View>
  );
};

export default CompKanjiChallenge;
