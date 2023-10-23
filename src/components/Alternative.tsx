import React, { FC } from "react";
import { View } from "react-native";
import DropLocation from "./DropLocation";
import Draggable from "./Draggable";
import Interactable from "../displays/Interactable";
import Outline from "../displays/Outline";

type Props = {
  text: string;
};

/** Draggable on top of an outline */
const Alternative: FC<Props> = ({ text }) => (
  <View className="items-center">
    <DropLocation className="absolute" text={text}>
      <Outline text={text} style={{ height: 56, width: 56 }} />
    </DropLocation>
    <Draggable>
      <Interactable text={text} />
    </Draggable>
  </View>
);

export default Alternative;
