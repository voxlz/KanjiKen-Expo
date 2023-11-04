import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Animated, View, Pressable } from "react-native";
import Draggable from "./Draggable";
import Interactable from "../displays/Interactable";
import Outline from "../displays/Outline";
import { useMeasure } from "../functions/useMeasure";
import { GlyphInfo } from "../contexts/ChallengeContextProvider";

type Props = {
  altInfo: GlyphInfo;
  dragOpacity?: Animated.Value;
  dragScale?: Animated.Value;
  width: number;
};

/** Draggable on top of an outline */
const Alternative: FC<Props> = ({ altInfo, dragOpacity, dragScale, width }) => {
  const glyph = altInfo.glyph;
  const { measure: anchor, onLayout, ref } = useMeasure();
  const [, setShow] = useState(false);

  return (
    <View
      className="aspect-square flex-grow flex-shrink"
      style={{ width: width }}
    >
      {/* ----------- Outline - Bottom layer-------------- */}
      <Pressable
        className="aspect-square flex-grow flex-shrink basis-1/5 z-0"
        style={{ width: width }}
        ref={ref}
        onLayout={onLayout}
        onPress={() => setShow((state) => !state)}
      >
        <Outline text={glyph} />
      </Pressable>

      {/* ------------- Interactable - Middle layer --------------*/}
      <View className="absolute z-10">
        <Draggable
          anchor={anchor}
          width={width}
          text={glyph}
          dragOpacity={dragOpacity}
          dragScale={dragScale}
        >
          <Interactable text={glyph} />
        </Draggable>
      </View>

      {/* ------------ Help box - Top Layer -------------- */}
      {/* {anchor && <GlyphHint anchor={anchor} hintText={meaning} show={show} />} */}
    </View>
  );
};

export default Alternative;
