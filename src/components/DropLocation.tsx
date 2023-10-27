import React, { FC, useContext, useEffect, useRef } from "react";
import { View, ViewProps } from "react-native";
import { DragContext } from "../contexts/DragContextProvider";
import { useMeasure } from "../functions/useMeasure";

type Props = {
  children: React.ReactNode;
  text: string;
} & ViewProps;

/** Make this component a possible drop location */
const DropLocation: FC<Props> = ({ children, text, ...props }) => {
  const { updateDropRect, isDroppable } = useContext(DragContext);
  const { ref, onLayout, measure } = useMeasure();

  useEffect(() => {
    if (measure) updateDropRect?.({ glyph: text, ...measure });
  }, [measure]);

  return (
    <View
      className="self-stretch flex-grow"
      {...props}
      style={[
        {
          backgroundColor:
            isDroppable?.()?.x === measure?.x ? "blue" : undefined,
        },
        props.style,
      ]}
      ref={ref}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
};

export default DropLocation;
