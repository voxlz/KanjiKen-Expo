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
      className="flex-grow flex-shrink flex-col bg-ui-normal rounded-xl border-[3px] border-b-[5px] border-ui-disabled"
    >
      <View className="flex-grow" />
      <View className="flex-row">
        <View className="flex-grow" />
        <View>
          <Text
            style={{ fontFamily: "KleeOne_600SemiBold" }}
            className=" text-ui-text text-4xl leading-none"
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
