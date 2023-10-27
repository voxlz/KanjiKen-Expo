import { useRef, useState } from "react";
import { MeasureType } from "../components/Alternative";
import { View } from "react-native";

/** Measure size and location of a component.
 * Just put ref and onLayout on the component youre measuring. */
export const useMeasure = () => {
  const ref = useRef<View>(null); // Ref to view
  const [measure, setMeasure] = useState<MeasureType>();
  const onLayout = () => {
    ref.current?.measure((x, y, width, height, pagex, pagey) => {
      const bound = {
        height: height,
        width: width,
        left: x,
        top: y,
        x: pagex,
        y: pagey,
      };
      setMeasure(bound);
    });
  };

  return { ref, measure, onLayout };
};
