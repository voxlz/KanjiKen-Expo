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
} & ViewProps;

type Size = {
  height: number;
  width: number;
};

/** Makes children draggable. */
const Draggable: FC<Props> = ({ children, anchor, text: glyph, ...props }) => {
  const { setLocation, isDroppable, updateDropRect, resetContainsDroppable } =
    useContext(DragContext); // Access the drag logic
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
    const dropPos = isDroppable?.();
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: "spring", springDamping: 1 },
    }); // Animate next layout change

    // Drop successful
    if (dropPos && anchor && !dropPos.contains) {
      const newSize = { width: dropPos.width, height: dropPos.height };
      const newTrans = { x: dropPos.x - anchor.x, y: dropPos.y - anchor.y };
      setCurrentSize(newSize);
      moveTo(newTrans);
      dropPos.contains = glyph;
      updateDropRect?.(dropPos);
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
        className="absolute"
        style={{
          transform: [
            { translateX: translation.x },
            { translateY: translation.y },
          ],
          zIndex: isBeingDragged ? 10 : 1,
          elevation: isBeingDragged ? 10 : 1,
          height: currSize ? currSize.height : anchor?.height,
          width: currSize ? currSize.width : anchor?.width,
          top: anchor?.top,
          left: anchor?.left,
        }}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default Draggable;
