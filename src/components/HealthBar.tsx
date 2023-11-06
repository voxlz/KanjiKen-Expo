import React, { FC, useContext } from "react";
import { View } from "react-native";
import SVGImg from "../../assets/ph_heart-duotone.svg";
import {
  RelativeHealthContext,
  HealthColorContext,
} from "../contexts/HealthContextProvider";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  altWidth: number; // 1/3th height of alt component
};

/** Keeps track of current health */
const HealthBar: FC<Props> = ({ altWidth }) => {
  const relativeHealth = useContext(RelativeHealthContext);
  const healthColor = useContext(HealthColorContext);

  const height = altWidth / 3;

  const healthBarStyle = useAnimatedStyle(() => {
    if (healthColor && relativeHealth) {
      const healthLight = interpolateColor(
        healthColor.value,
        [0, 1],
        ["rgba(228, 106, 106, 1)", "rgba(204, 232, 174, 1)"]
      );
      return {
        backgroundColor: healthLight,
        height: height - 6,
        width: `${relativeHealth.value}%`,
      };
    } else return {};
  });

  const healthBackground = useAnimatedStyle(() => {
    if (healthColor && relativeHealth) {
      const background = interpolateColor(
        healthColor.value,
        [0, 1],
        ["#B03A3A", "rgba(83, 136, 40, 1)"]
      );
      const border = interpolateColor(
        healthColor.value,
        [0, 1],
        ["#6C2424", "#46622F"]
      );
      return {
        backgroundColor: background,
        borderColor: border,
        borderRadius: 9,
        height: height,
        flexGrow: 1,
      };
    } else return {};
  });

  return (
    <View style={{ gap: 12 }} className="flex-row px-9 ">
      <SVGImg
        width={height * 1.4}
        height={height * 1.4}
        style={{ marginTop: -height * 0.2 }}
        className="bg-red-400"
      />
      <Animated.View
        style={healthBackground}
        className="flex-grow  border-[3px] items-end justify-center"
      >
        {/* <Text className=" text-forest-200">300</Text> */}
        <Animated.View
          style={healthBarStyle}
          className="absolute rounded-md items-end justify-center inset-3 self-start"
        >
          {/* <Text className="text-forest-800">200</Text> */}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default HealthBar;
