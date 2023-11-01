import React, { FC, useContext, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  NativeModules,
  Platform,
  ViewProps,
} from "react-native";
import { DragContext } from "../contexts/DragContextProvider";
import { MeasureType } from "./Alternative";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { ChallengeContext } from "../contexts/ChallengeContextProvider";

const { UIManager } = NativeModules;

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type Props = {
  anchor?: MeasureType; // Default position / size
  children?: React.ReactNode;
  text?: string;
  dragOpacity?: Animated.Value;
  dragScale?: Animated.Value;
  width: number;
} & ViewProps;

type Size = {
  height: number;
  width: number;
};

/** Makes children draggable. */
const Draggable: FC<Props> = ({
  children,
  anchor,
  width,
  text: glyph,
  dragOpacity,
  dragScale,
  ...props
}) => {
  const { setLocation, updateDropRect, resetContainsDroppable, hoverDropPos } =
    useContext(DragContext); // Access the drag logic
  const { checkAnswer } = useContext(ChallengeContext);
  const translation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isBeingDragged, setIsBeingDragged] = useState(false); // is draggable being dragging?

  // const [startBound, setStartBound] = useState<LayoutRectangle>(); // Remember initial size and position of this object
  const [currSize, setCurrentSize] = useState<Size>(); // Set current size of the draggable
  const [dragStart, setBeforeDragTransform] = useState({
    x: 0,
    y: 0,
  });

  const pan = Gesture.Pan();

  pan.onBegin(() => {
    resetContainsDroppable?.(glyph ?? "");
  });

  pan.onChange((drag) => {
    setIsBeingDragged(true);
    const trans = {
      x: dragStart.x + drag.translationX,
      y: dragStart.y + drag.translationY,
    };
    const loc = { x: drag.absoluteX, y: drag.absoluteY };
    translation.setValue(trans);
    setLocation?.(loc);
  });

  pan.onEnd(() => {
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: "spring", springDamping: 1 },
    }); // Animate next layout change

    // Drop successful
    if (
      hoverDropPos &&
      anchor &&
      !hoverDropPos.contains &&
      checkAnswer?.(glyph)
    ) {
      const newSize = {
        width: hoverDropPos.width,
        height: hoverDropPos.height,
      };
      const newTrans = {
        x: hoverDropPos.x - anchor.x,
        y: hoverDropPos.y - anchor.y,
      };
      setCurrentSize(newSize);
      moveTo(newTrans);
      hoverDropPos.contains = glyph;
      updateDropRect?.(hoverDropPos);

      console.log("newSize", newSize);
    }
    // Drop failed.
    else {
      moveTo({ x: 0, y: 0 });
      if (anchor) {
        setCurrentSize({ width: anchor.width, height: anchor.height });
      }
    }
    setLocation?.();
    setIsBeingDragged(false);
  });

  // Move to new default position
  const moveTo = (newpan: { x: number; y: number }) => {
    Animated.spring(translation, {
      toValue: newpan,
      useNativeDriver: true,
    }).start();
    setBeforeDragTransform(newpan);
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        id="animate_position"
        className="absolute"
        style={{
          transform: [
            { translateX: translation.x },
            { translateY: translation.y },
          ],
          zIndex: isBeingDragged ? 10 : 1,
          elevation: isBeingDragged ? 10 : 1,
          height: currSize ? currSize.height : width,
          width: currSize ? currSize.width : width,
        }}
      >
        <Animated.View
          className="flex-grow"
          style={{
            opacity: dragOpacity,
            transform: [{ scale: dragScale ?? 1 }],
          }}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Draggable;
