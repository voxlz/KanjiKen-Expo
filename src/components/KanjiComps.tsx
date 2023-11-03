import React, { FC } from "react";
import { Position } from "../data_loading/glyphDict";
import { View } from "react-native";
import Outline from "../displays/Outline";
import DropLocation from "./DropLocation";

type Props = {
  pos: Position | undefined;
};

/** Places the dropLocations in accordance with position object.
 */
const KanjiComps: FC<Props> = ({ pos }) => {
  // console.log("KANJI COMPS UPDATE");
  return (
    <View className="flex-grow flex-shrink">
      {Object.entries(pos ?? {}).map(([key, value], i) => (
        <View
          style={{ gap: 12 }}
          className={
            "flex-grow flex-shrink " + (key.startsWith("col") ? "" : "flex-row")
          }
          key={i}
        >
          {value.map((strOrPos, j) => {
            if (typeof strOrPos === "string") {
              return (
                <DropLocation text={strOrPos as string} key={j}>
                  <Outline text={strOrPos as string} />
                </DropLocation>
              );
            } else {
              return <KanjiComps pos={strOrPos as Position} key={j} />;
            }
          })}
        </View>
      ))}
    </View>
  );
};

export default KanjiComps;
