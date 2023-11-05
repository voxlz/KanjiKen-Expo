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
  expectedChoice: string;
};

/** Draggable on top of an outline */
const Alternative: FC<Props> = ({
  altInfo,
  dragOpacity,
  dragScale,
  width,
  expectedChoice,
}) => {
  const glyph = altInfo.glyph;
  const { measure: anchor, onLayout, ref } = useMeasure();
  const [, setShow] = useState(false);
  const [isBeingDragged, setIsBeingDragged] = useState(false); // is draggable being dragging?

  return (
    <View
      className="aspect-square flex-grow flex-shrink z-0"
      style={{ width: width, zIndex: isBeingDragged ? 30 : 10 }}
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

      <View
        style={{
          pointerEvents:
            !!dragOpacity && expectedChoice === "FINISH" ? "none" : "auto",
        }}
        className="absolute z-20"
      >
        <Draggable
          anchor={anchor}
          width={width}
          glyph={glyph}
          dragOpacity={dragOpacity}
          dragScale={dragScale}
          isBeingDragged={isBeingDragged}
          setIsBeingDragged={setIsBeingDragged}
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
