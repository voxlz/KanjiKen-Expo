import React, { FC } from "react";
import { View, Text } from "react-native";

type Props = {};

/** Display challenge title and challenge number */
const StatusBar: FC<Props> = ({}) => (
  <View className="flex-row justify-between self-stretch flex-grow px-9 mt-3 h-auto flex-shrink items-start">
    <Text
      style={{ fontFamily: "NotoSansJP_700Bold" }}
      className="text-xl capitalize  flex-shrink flex-grow "
    >
      Build Kanji
    </Text>
    <Text
      style={{ fontFamily: "NotoSansJP_400Regular" }}
      className="text-xl capitalize"
    >
      13/20
    </Text>
  </View>
);

export default StatusBar;
