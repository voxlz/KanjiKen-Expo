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
      className="flex-grow flex-shrink bg-none rounded-xl border-[3px] border-ui-disabled border-dashed items-center justify-center"
    >
      <Text
        style={{ fontFamily: "KleeOne_600SemiBold" }}
        className="text-center text-ui-disabled text-4xl leading-none"
      >
        {text}
      </Text>
    </View>
  );
};

export default Outline;
