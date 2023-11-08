import React, { FC } from "react";
import { View, Text } from "react-native";

type Props = {
  seenCount: number;
};

/** Display challenge title and challenge number */
const StatusBar: FC<Props> = ({ seenCount }) => (
  <View className="flex-row justify-between self-stretch px-9 mt-2 h-auto flex-shrink items-start mb-8">
    <Text
      style={{ fontFamily: "NotoSansJP_700Bold" }}
      className="text-xl capitalize  flex-shrink flex-grow  "
    >
      Build Kanji
    </Text>
    <Text
      style={{ fontFamily: "NotoSansJP_400Regular" }}
      className="text-xl capitalize "
    >
      {seenCount}/20
    </Text>
  </View>
);

export default StatusBar;
