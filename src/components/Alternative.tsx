import React, { FC } from "react";
import { Animated, View } from "react-native";
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
};

/** Draggable on top of an outline */
const Alternative: FC<Props> = ({ altInfo, dragOpacity, dragScale }) => {
  const { ref, measure, onLayout } = useMeasure();
  const text = altInfo.glyph;
  return (
    <>
      <View
        id={"anchor-" + text}
        className="aspect-square flex-grow flex-shrink basis-1/5 "
        ref={ref}
        onLayout={onLayout}
      >
        <HelpBox meaning={altInfo.meanings.primary}>
          <Outline text={text} />
        </HelpBox>
      </View>
      <Draggable
        anchor={measure}
        text={text}
        dragOpacity={dragOpacity}
        dragScale={dragScale}
      >
        <Interactable text={text} />
      </Draggable>
    </>
  );
};

export default Alternative;
export type MeasureType = {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
};
