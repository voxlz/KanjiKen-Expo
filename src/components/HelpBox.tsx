import React, { FC, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useMeasure } from "../functions/useMeasure";

type Props = {
  children: React.ReactNode;
  meaning: string;
};

/** Help text that pops up on click or hold. Usually shows meaning of a glyph. */
const HelpBox: FC<Props> = ({ children, meaning }) => {
  const { measure, onLayout, ref } = useMeasure();
  const { measure: text, onLayout: textOnLayout, ref: textRef } = useMeasure();
  const [show, setShow] = useState(false);
  return (
    <View className="flex-grow  flex-shrink">
      <View
        style={{
          opacity: show ? 1 : 0,
        }}
        className="absolute w-screen h-screen to-blue-500"
      >
        <View
          id="hint"
          style={{
            left: show ? (measure?.width ?? 0) / 2 - (text?.width ?? 0) / 2 : 0,
            top: show ? -(text?.height ?? 0) - 10 : 0,
            width: show ? undefined : 0,
            height: show ? undefined : 0,
          }}
          ref={textRef}
          onLayout={textOnLayout}
          className="bg-ui-normal  self-start rounded-lg "
        >
          <Text className="mx-4 my-3 text-xl capitalize">{meaning}</Text>
        </View>
        <View
          style={{
            left: (measure?.width ?? 0) / 2 - 10,
            top: -(text?.height ?? 0) - 10,
          }}
          className="w-0 h-0 border-transparent border-t-[10px] border-b-0 border-x-[10px] border-t-ui-normal
		"
        />
      </View>
      <Pressable
        ref={ref}
        onLayout={onLayout}
        className="flex-grow absolute w-full h-full"
        onPress={() => setShow((state) => !state)}
      >
        {children}
      </Pressable>
    </View>
  );
};

export default HelpBox;
