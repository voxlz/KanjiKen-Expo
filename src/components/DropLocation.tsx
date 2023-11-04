import React, { FC, useContext, useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";
import { useMeasure } from "../functions/useMeasure";
import { ExpectedChoiceContext } from "../contexts/ChallengeContextProvider";
import {
  DropsDispatchContext,
  hoverRef,
} from "../contexts/DragContextProvider";

type Props = {
  children: React.ReactNode;
  text: string;
} & ViewProps;

/** Make this component a possible drop location */
const DropLocation: FC<Props> = ({ children, text, ...props }) => {
  const dropsDispatch = useContext(DropsDispatchContext);
  const expectedChoice = useContext(ExpectedChoiceContext);

  const { ref, onLayout, measure } = useMeasure();

  useEffect(() => {
    if (measure && dropsDispatch)
      dropsDispatch({ type: "changed", dropInfo: { glyph: text, ...measure } });
  }, [measure]);

  // BACKGROUND COLOR - Does not currently work
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
    hoverRef &&
    measure &&
    hoverRef?.x === measure?.x &&
    hoverRef?.y === measure?.y;
  const isNext = expectedChoice === text;
  colorIndex.setValue(isHovered ? 1 : isNext ? 2 : 0);

  return (
    // <HelpBox meaning={meaning}>
    <Animated.View
      className="flex-grow flex-shrink rounded-xl"
      {...props}
      style={[props.style, { backgroundColor: bgColor }]}
      ref={ref}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
    // </HelpBox>
  );
};

export default DropLocation;
