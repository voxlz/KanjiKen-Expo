import React, { FC, useContext, useEffect, useMemo, useRef } from "react";
import { Animated, View, ViewProps } from "react-native";
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
  const { getGlyphInfo, getNextAnswer } = useContext(ChallengeContext);
  const { ref, onLayout, measure } = useMeasure();
  const meaning = useMemo(
    () => getGlyphInfo?.(text).meanings.primary ?? "ERROR",
    []
  );
  useEffect(() => {
    if (measure && updateDropInfo) updateDropInfo({ glyph: text, ...measure });
  }, [measure]);

  // BACKGROUND COLOR - Laggs wihtout as well
  const colorIndex = useRef(new Animated.Value(0)).current;
  const bgColor = colorIndex.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      "rgba(255, 255, 255, 1)", // default
      "rgba(243, 244, 246, 1)", // next
      "rgba(238, 244, 250, 1)", // hover
    ],
  });
  const isHovered =
    hoverDropInfo &&
    measure &&
    hoverDropInfo?.x === measure?.x &&
    hoverDropInfo?.y === measure?.y;
  const isNext = getNextAnswer?.() === text;
  colorIndex.setValue(isHovered ? 1 : isNext ? 2 : 0);

  return (
    <HelpBox meaning={meaning}>
      <Animated.View
        className="flex-grow flex-shrink rounded-xl"
        {...props}
        style={[props.style, { backgroundColor: bgColor }]}
        ref={ref}
        onLayout={onLayout}
      >
        {children}
      </Animated.View>
    </HelpBox>
  );
};

export default DropLocation;
