import React, { FC, useLayoutEffect, useRef, useState } from "react";
import { Animated, View, Text, Pressable } from "react-native";
import Draggable from "./Draggable";
import Interactable from "../displays/Interactable";
import Outline from "../displays/Outline";
import { useMeasure } from "../functions/useMeasure";
import { GlyphInfo } from "../contexts/ChallengeContextProvider";
import HelpBox from "./HelpBox";

type Props = {
  altInfo: GlyphInfo;
  dragOpacity?: Animated.Value;
  dragScale?: Animated.Value;
  windowRef?: React.RefObject<View>;
};

/** Draggable on top of an outline */
const Alternative: FC<Props> = ({
  altInfo,
  dragOpacity,
  dragScale,
  windowRef,
}) => {
  const glyph = altInfo.glyph;
  const { measure, onLayout, ref } = useMeasure();
  const {
    measure: text,
    onLayout: textOnLayout,
    ref: textContRef,
  } = useMeasure();
  const [show, setShow] = useState(false);
  const meaning = altInfo.meanings.primary;

  return (
    <>
      {/* Outline - Bottom layer */}
      <Pressable
        className="aspect-square flex-grow flex-shrink basis-1/5 z-0"
        ref={ref}
        onLayout={onLayout}
        onPress={() => setShow((state) => !state)}
      >
        <Outline text={glyph} />
      </Pressable>
      {/* Interactable - Middle layer */}
      <View className="absolute z-10">
        <Draggable
          anchor={measure}
          text={glyph}
          dragOpacity={dragOpacity}
          dragScale={dragScale}
        >
          <Interactable text={glyph} />
        </Draggable>
      </View>
      {/* Help box - Top Layer */}
      {measure && (
        <View
          style={{
            opacity: show ? 1 : 0,
            left: measure.left - ((text?.width ?? 0) - measure.width) / 2,
            top: measure.top - (text?.height ?? 0) - 10,
            width: show ? text?.width : 0,
            height: text?.height,
          }}
          className="absolute h-16 z-20"
        >
          <View
            id="hint"
            style={{
              width: show ? undefined : 0,
              height: show ? undefined : 0,
            }}
            ref={textContRef}
            onLayout={() => {
              if (show) textOnLayout();
            }}
            className="bg-ui-normal  self-start rounded-lg "
          >
            <Text className="mx-4 my-3 text-xl capitalize">{meaning}</Text>
          </View>
          <View
            style={{
              left: (text?.width ?? 0) / 2 - 10,
              top: 0,
            }}
            className="w-0 h-0 border-transparent border-t-[10px] border-b-0 border-x-[10px] border-t-ui-normal
		"
          />
        </View>
      )}
    </>
  );
};

export default Alternative;

export type LayoutType = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type MeasureType = LayoutType & {
  top: number;
  left: number;
};
