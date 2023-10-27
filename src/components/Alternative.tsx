import React, { FC, useRef, useState } from "react";
import { View } from "react-native";
import DropLocation from "./DropLocation";
import Draggable from "./Draggable";
import Interactable from "../displays/Interactable";
import Outline from "../displays/Outline";
import { useMeasure } from "../functions/useMeasure";

type Props = {
  text: string;
};

export type MeasureType = {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
};

/** Draggable on top of an outline */
const Alternative: FC<Props> = ({ text }) => {
  const { ref, measure, onLayout } = useMeasure();
  return (
    <>
      <View
        id={"anchor-" + text}
        className="aspect-square flex-grow flex-shrink basis-1/5"
        ref={ref}
        onLayout={onLayout}
      >
        <Outline text={text} />
      </View>
      <Draggable anchor={measure} text={text}>
        <Interactable text={text} />
      </Draggable>
    </>
  );
};

export default Alternative;
