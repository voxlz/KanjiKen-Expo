import React, { FC, useContext, useEffect, useMemo } from "react";
import { View, ViewProps } from "react-native";
import { DragContext } from "../contexts/DragContextProvider";
import { useMeasure } from "../functions/useMeasure";
import { ChallengeContext } from "../contexts/ChallengeContextProvider";
import HelpBox from "./HelpBox";

type Props = {
  children: React.ReactNode;
  text: string;
} & ViewProps;

/** Make this component a possible drop location */
const DropLocation: FC<Props> = ({ children, text, ...props }) => {
  const { updateDropInfo, hoverDropInfo } = useContext(DragContext);
  const { getNextAnswer, getGlyphInfo } = useContext(ChallengeContext);
  const { ref, onLayout, measure } = useMeasure();

  useEffect(() => {
    if (measure && updateDropInfo) updateDropInfo({ glyph: text, ...measure });
  }, [measure]);

  const meaning = getGlyphInfo?.(text).meanings.primary ?? "ERROR";
  const isHovered =
    hoverDropInfo?.x === measure?.x && hoverDropInfo?.y === measure?.y;
  const isNext = getNextAnswer?.() === text;

  return (
    <HelpBox meaning={meaning}>
      <View
        className={
          "flex-grow flex-shrink rounded-xl " +
          (isHovered ? "bg-highlight-blue" : isNext ? "bg-gray-100" : "")
        }
        {...props}
        style={[props.style]}
        ref={ref}
        onLayout={onLayout}
      >
        {children}
      </View>
    </HelpBox>
  );
};

export default DropLocation;
