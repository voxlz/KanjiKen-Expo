import { View, Text, StyleProp, ViewStyle } from "react-native";
import React from "react";

type Props = {
  text?: String;
  style?: StyleProp<ViewStyle>;
};

const Interactable = ({ text, style }: Props) => {
  return (
    <View
      style={style}
      className="flex-col w-full h-full bg-gray-200 rounded-lg border-l-2 border-r-2 border-t-2 border-b-4 border-neutral-400"
    >
      <View className="flex-grow" />
      <View className="flex-row">
        <View className="flex-grow" />
        <View>
          <Text
            style={{ fontFamily: "KleeOne_600SemiBold" }}
            className=" text-black text-3xl leading-none"
          >
            {text}
          </Text>
        </View>
        <View className="flex-grow " />
      </View>
      <View className="flex-grow " />
    </View>
  );
};

export default Interactable;
