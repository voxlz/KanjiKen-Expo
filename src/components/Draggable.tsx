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
import GlyphHint from "./GlyphHint";

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
  const {
    setDragLoc,
    updateDropInfo: updateDropRect,
    resetContainsDroppable,
    getDropInfo,
    hoverDropInfo: hoverDropPos,
  } = useContext(DragContext); // Access the drag logic
  const { isGlyphNext, advanceOrder, getGlyphInfo } =
    useContext(ChallengeContext);
  const translation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isBeingDragged, setIsBeingDragged] = useState(false); // is draggable being dragging?

  // const [startBound, setStartBound] = useState<LayoutRectangle>(); // Remember initial size and position of this object
  const [currSize, setCurrentSize] = useState<Size>(); // Set current size of the draggable
  const [dragStart, setBeforeDragTransform] = useState({
    x: 0,
    y: 0,
  });

  const tap = Gesture.Tap();
  const drag = Gesture.Pan();
  const composed = Gesture.Simultaneous(tap, drag);

  tap.onEnd(() => {
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: "spring", springDamping: 1 },
    }); // Animate next layout change

    // Drop successful
    const dropInfo = getDropInfo?.(glyph ?? "");
    console.log("tap", dropInfo);

    if (anchor && isGlyphNext?.(glyph) && dropInfo) {
      advanceOrder?.();
      const newSize = {
        width: dropInfo.width,
        height: dropInfo.height,
      };
      const newTrans = {
        x: dropInfo.x - anchor.x,
        y: dropInfo.y - anchor.y,
      };
      setCurrentSize(newSize);
      moveTo(newTrans);
      dropInfo.containsGlyph = glyph;
      updateDropRect?.(dropInfo);
    }
  });

  drag.onBegin(() => {
    resetContainsDroppable?.(glyph ?? "");
    console.log("start drag");
  });

  drag.onChange((drag) => {
    setIsBeingDragged(true);
    const trans = {
      x: dragStart.x + drag.translationX,
      y: dragStart.y + drag.translationY,
    };
    const loc = { x: drag.absoluteX, y: drag.absoluteY };
    translation.setValue(trans);
    setDragLoc?.(loc);
  });

  drag.onEnd(() => {
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: "spring", springDamping: 1 },
    }); // Animate next layout change

    // Drop successful
    if (
      !!hoverDropPos &&
      anchor &&
      !hoverDropPos.containsGlyph &&
      isGlyphNext?.(glyph)
    ) {
      advanceOrder?.();

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
      hoverDropPos.containsGlyph = glyph;
      updateDropRect?.(hoverDropPos);
    }
    // Drop failed.
    else {
      moveTo({ x: 0, y: 0 });
      if (anchor) {
        setCurrentSize({ width: anchor.width, height: anchor.height });
      }
    }
    setDragLoc?.();
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
    <GestureDetector gesture={composed}>
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
        <GlyphHint
          anchor={{
            height: currSize ? currSize.height : width,
            width: currSize ? currSize.width : width,
            left: 0,
            top: 0,
            x: 0,
            y: 0,
          }}
          hintText={getGlyphInfo?.(glyph ?? "").meanings.primary ?? ""}
          show={isBeingDragged}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default Draggable;
