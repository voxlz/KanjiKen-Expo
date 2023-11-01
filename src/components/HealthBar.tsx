import React, { FC, useState } from "react";
import { Text, View } from "react-native";
import SVGImg from "../../assets/ph_heart-duotone.svg";

type Props = {
  altWidth: number; // 1/3th height of alt component
};

/** Keeps track of current health */
const HealthBar: FC<Props> = ({ altWidth }) => {
  const [progress, setProgress] = useState(0.67);
  const height = altWidth / 3;
  return (
    <View style={{ gap: 12 }} className="flex-row px-9 ">
      <SVGImg
        width={height * 1.4}
        height={height * 1.4}
        style={{ marginTop: -height * 0.2 }}
        className="bg-red-400"
      />
      <View
        style={{ height: height }}
        className="flex-grow bg-forest-600 rounded-lg border-forest-900 border-2 items-end justify-center px-1"
      >
        {/* <Text className=" text-forest-200">300</Text> */}
        <View
          style={{
            height: height - 4,
            width: `${progress * 100}%`,
          }}
          className="absolute bg-forest-200 rounded-md items-end justify-center px-1 inset-3 self-start"
        >
          {/* <Text className="text-forest-800">200</Text> */}
        </View>
      </View>
    </View>
  );
};

export default HealthBar;
