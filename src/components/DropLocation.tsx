import React, { FC, useContext, useEffect } from "react";
import { View, ViewProps } from "react-native";
import { DragContext } from "../contexts/DragContextProvider";
import { useMeasure } from "../functions/useMeasure";
import { ChallengeContext } from "../contexts/ChallengeContextProvider";

type Props = {
  children: React.ReactNode;
  text: string;
} & ViewProps;

/** Make this component a possible drop location */
const DropLocation: FC<Props> = ({ children, text, ...props }) => {
  const { updateDropRect, hoverDropPos } = useContext(DragContext);
  const { getNextAnswer } = useContext(ChallengeContext);

  const { ref, onLayout, measure } = useMeasure();

  useEffect(() => {
    if (measure) updateDropRect?.({ glyph: text, ...measure });
  }, [measure]);

  return (
    <View
      className={
        "flex-grow flex-shrink rounded-xl " +
        (hoverDropPos?.x === measure?.x && hoverDropPos?.y === measure?.y
          ? "bg-highlight-blue"
          : getNextAnswer?.() === text
          ? "bg-gray-100"
          : "")
      }
      {...props}
      style={[props.style]}
      ref={ref}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
};

export default DropLocation;
