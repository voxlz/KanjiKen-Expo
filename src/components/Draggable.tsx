import React, { FC, useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  NativeModules,
  Platform,
  ViewProps,
} from "react-native";
import {
  HoverUpdateContext,
  DropsContext,
  hoverRef,
} from "../contexts/DragContextProvider";
import {} from "./Alternative";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import {
  ExpectedChoiceContext,
  OnCorrectChoiceContext,
  GetGlyphContext,
} from "../contexts/ChallengeContextProvider";
import GlyphHint from "./GlyphHint";
import { DropInfo, MeasureType } from "../types/dropInfo";
import {
  HoverContext,
  WasSuccessfulDropContext,
} from "../contexts/DragContextProvider";

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
  // ...props
}) => {
  // const hover = useContext(HoverContext);
  const hoverUpdate = useContext(HoverUpdateContext);
  const drops = useContext(DropsContext);
  const expectedChoice = useContext(ExpectedChoiceContext);
  const onCorrectChoice = useContext(OnCorrectChoiceContext);
  const getGlyph = useContext(GetGlyphContext);

  const translation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isBeingDragged, setIsBeingDragged] = useState(false); // is draggable being dragging?

  console.log(
    "rerender dragable",
    glyph,
    drops.map((drop) => drop.glyph)
  );

  // const [startBound, setStartBound] = useState<LayoutRectangle>(); // Remember initial size and position of this object
  const [currSize, setCurrentSize] = useState<Size>(); // Set current size of the draggable
  const [dragStart, setBeforeDragTransform] = useState({
    x: 0,
    y: 0,
  });

  const tap = Gesture.Tap();
  const drag = Gesture.Pan();
  const composed = Gesture.Simultaneous(drag);

  // tap.onEnd(() => {
  //   LayoutAnimation.configureNext({
  //     duration: 300,
  //     update: { type: "spring", springDamping: 1 },
  //   }); // Animate next layout change

  //   // Drop successful
  //   const dropInfo = drops.find((info) => info.glyph === glyph);
  //   // console.log("tap", dropInfo);

  //   if (anchor && expectedChoice === glyph && dropInfo) {
  //     onCorrectChoice?.();
  //     const newSize = {
  //       width: dropInfo.width,
  //       height: dropInfo.height,
  //     };
  //     const newTrans = {
  //       x: dropInfo.x - anchor.x,
  //       y: dropInfo.y - anchor.y,
  //     };
  //     setCurrentSize(newSize);
  //     moveTo(newTrans);
  //   }
  // });

  drag.onBegin(() => {
    setIsBeingDragged(true);
  });

  drag.onChange((drag) => {
    hoverUpdate?.({ x: drag.absoluteX, y: drag.absoluteY });
    translation.setValue({
      x: dragStart.x + drag.translationX,
      y: dragStart.y + drag.translationY,
    });
  });
  drag.onFinalize(() => {
    setIsBeingDragged(false);
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: "spring", springDamping: 1 },
    });

    // Drop successful
    const hover = hoverRef;
    if (
      hover &&
      hover.glyph === glyph && // currently hovering over droplocation with the right glyph
      anchor &&
      !hover.containsGlyph &&
      expectedChoice === glyph // Is this glyph the right input
    ) {
      console.log("success");

      onCorrectChoice?.();

      const newSize = {
        width: hover.width,
        height: hover.height,
      };
      const newTrans = {
        x: hover.x - anchor.x,
        y: hover.y - anchor.y,
      };
      if (
        currSize?.height !== newSize.height &&
        currSize?.width !== newSize.width
      )
        setCurrentSize(newSize);
      moveTo(newTrans);
    }
    // Drop failed.
    else {
      moveTo({ x: 0, y: 0 });
      if (anchor) {
        if (
          currSize?.height !== anchor.height &&
          currSize?.width !== anchor.width
        )
          setCurrentSize({ width: anchor.width, height: anchor.height });
      }
    }
    hoverUpdate?.();
  });

  // Move to new default position
  const moveTo = (newpan: { x: number; y: number }) => {
    Animated.spring(translation, {
      toValue: newpan,
      useNativeDriver: true,
    }).start();
    if (dragStart.x !== newpan.x && dragStart.y !== newpan.y)
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
          hintText={getGlyph?.(glyph)?.meanings.primary ?? ""}
          show={isBeingDragged}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default Draggable;
