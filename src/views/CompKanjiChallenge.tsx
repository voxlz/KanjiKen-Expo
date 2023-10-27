import React, { FC, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import Alternative from "../components/Alternative";
import KanjiComps from "../components/KanjiComps";
import { glyphDict } from "../data_loading/glyphDict";
import { shuffle } from "../functions/shuffle";
import { ChallengeContext } from "../contexts/ChallengeContextProvider";

type Props = {};

/** The general challenge view for building a kanji through components */
const CompKanjiChallenge: FC<Props> = ({}) => {
  const { setGlyph } = useContext(ChallengeContext);
  const [alts, setAlts] = useState<string[]>([]);
  const gd = glyphDict();

  useEffect(() => {
    setGlyph?.(gd["鬱"]);
  }, []);

  const order = gd["鬱"].comps.order;
  const position = gd["鬱"].comps.position;
  const meaning = gd["鬱"].meanings.primary;

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
      <View style={{ gap: 12 }} className="w-2/3 h-auto aspect-square">
        <KanjiComps pos={position} />
      </View>
      <Text className="text-4xl capitalize">{meaning}</Text>
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
