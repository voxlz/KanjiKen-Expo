import { View, Text, StyleProp, ViewStyle } from "react-native";
import React, { FC } from "react";

type Props = {
  text?: string;
  style?: StyleProp<ViewStyle>;
};

const Outline: FC<Props> = ({ text, style }) => {
  return (
    <View
      style={style}
      className="flex-grow flex-shrink bg-none rounded-lg border-2 border-neutral-400 border-dashed items-center justify-center"
    >
      <Text
        style={{ fontFamily: "KleeOne_600SemiBold" }}
        className="text-center text-neutral-400 text-4xl leading-none"
      >
        {text}
      </Text>
    </View>
  );
};

export default Outline;
