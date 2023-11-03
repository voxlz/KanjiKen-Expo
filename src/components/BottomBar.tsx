import React, { FC } from "react";
import { Animated, View } from "react-native";
import Button from "./Button";

type Props = {
  onContinue: () => void;
  yOffset: Animated.Value;
  altWidth: number;
};

/** The 'continue to next challenge' bar. */
const BottomBar: FC<Props> = ({ onContinue, yOffset, altWidth }) => (
  <Animated.View
    style={{
      aspectRatio: "20 / 7",
      transform: [{ translateY: yOffset }],
    }}
    className="  w-full h-auto py-6  mt-4"
  >
    <View style={{ height: 0.85714285714 * altWidth }} className="px-8 ">
      <Button text="Continue" onPress={onContinue} />
    </View>
    <View
      className="absolute h-40  w-full bottom-0 -z-10"
      style={{
        transform: [{ translateY: 150 }],
      }}
    />
    {/* ^ Hacky bottom bar that extends the bg below the screen. Does not take up any space. To ensure the spring animation does not show white at the bottom. */}
  </Animated.View>
);

export default BottomBar;
