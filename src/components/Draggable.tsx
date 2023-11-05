import React, { FC, useContext, useRef, useState } from "react";
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
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import {
  ExpectedChoiceContext,
  OnCorrectChoiceContext,
  GetGlyphContext,
} from "../contexts/ChallengeContextProvider";
import GlyphHint from "./GlyphHint";
import { DropInfo, MeasureType } from "../types/dropInfo";

const { UIManager } = NativeModules;

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type Props = {
  anchor?: MeasureType; // Default position / size
  children?: React.ReactNode;
  glyph?: string;
  dragOpacity?: Animated.Value;
  dragScale?: Animated.Value;
  width: number;
  setIsBeingDragged: (bool: boolean) => void;
  isBeingDragged: boolean;
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
  glyph,
  dragOpacity,
  dragScale,
  setIsBeingDragged,
  isBeingDragged,
  // ...props
}) => {
  // const hover = useContext(HoverContext);
  const hoverUpdate = useContext(HoverUpdateContext);
  const drops = useContext(DropsContext);
  const expectedChoice = useContext(ExpectedChoiceContext);
  const onCorrectChoice = useContext(OnCorrectChoiceContext);
  const getGlyph = useContext(GetGlyphContext);

  let [droppedBefore, setDroppedBefore] = useState(false);

  const translation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  console.log(
    "rerender dragable",
    glyph,
    drops.map((drop) => drop.glyph)
  );

  // const [startBound, setStartBound] = useState<LayoutRectangle>(); // Remember initial size and position of this object
  const [currSize, setCurrentSize] = useState<Size>(); // Set current size of the draggable
  const [dragStartTran, setDragStartTran] = useState({ x: 0, y: 0 }); // What translation did it had at drag start.
  const [dragStartSize, setDragStartSize] = useState({
    height: width,
    width: width,
  }); // What size did it had at drag start.

  const dropSuccessful = (hover: DropInfo, anchor: MeasureType) => {
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
    ) {
      setCurrentSize(newSize);
      setDragStartSize(newSize);
    }
    moveTo(newTrans);
    setDroppedBefore(true);
  };

  const prepForLayout = () =>
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: "spring", springDamping: 1 },
    });

  /** TAP - Memod as requested in documentation*/
  const tap = React.useMemo(
    () =>
      Gesture.Tap()
        .runOnJS(true)
        .onEnd(() => {
          prepForLayout();
          const dropInfo = drops.find((info) => info.glyph === glyph);
          if (anchor && expectedChoice === glyph && dropInfo) {
            dropSuccessful(dropInfo, anchor);
          }
          setIsBeingDragged(false);
        }),
    [anchor, drops, expectedChoice, glyph, prepForLayout]
  );

  /** DRAG */
  const drag = React.useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .onBegin(() => {
          setIsBeingDragged(true);
          currSize && setDragStartSize(currSize);
        })
        .onChange((drag) => {
          hoverUpdate?.({ x: drag.absoluteX, y: drag.absoluteY });
          let tx = drag.translationX;
          let ty = drag.translationY;
          // Respond to drag, but "don't let them move it"
          if (droppedBefore) {
            tx =
              tx < 0
                ? -Math.log2(Math.abs(tx / 20 - 1)) * 5 - 1
                : Math.log2(Math.abs(tx / 20 + 1)) * 5 + 1;
            ty =
              ty < 0
                ? -Math.log2(Math.abs(ty / 20 - 1)) * 5 - 1
                : Math.log2(Math.abs(ty / 20 + 1)) * 5 + 1;
          }

          translation.setValue({
            x: dragStartTran.x + tx,
            y: dragStartTran.y + ty,
          });
        })
        .onEnd(() => {
          setIsBeingDragged(false);
          prepForLayout();

          console.log("DROPED", droppedBefore);

          // Drop successful
          const hover = hoverRef;
          if (
            !droppedBefore &&
            hover &&
            hover.glyph === glyph && // currently hovering over droplocation with the right glyph
            anchor &&
            !hover.containsGlyph &&
            expectedChoice === glyph // Is this glyph the right input
          ) {
            dropSuccessful(hover, anchor);
          }
          // Drop failed.
          else {
            console.log("failed", droppedBefore);
            moveTo(dragStartTran);
            if (
              anchor &&
              currSize?.height !== dragStartSize.height &&
              currSize?.width !== dragStartSize.width
            ) {
              setCurrentSize({
                width: dragStartSize.width,
                height: dragStartSize.height,
              });
            }
          }
          hoverUpdate?.();
        })
        .onFinalize(() => {
          setIsBeingDragged(false);
        }),
    [
      hoverUpdate,
      translation,
      dragStartTran,
      currSize,
      anchor,
      expectedChoice,
      prepForLayout,
      setCurrentSize,
      setIsBeingDragged,
      droppedBefore,
    ]
  );

  const composed = Gesture.Exclusive(tap, drag);

  // Move to new default position
  const moveTo = (newpan: { x: number; y: number }) => {
    Animated.spring(translation, {
      toValue: newpan,
      useNativeDriver: true,
    }).start();
    if (dragStartTran.x !== newpan.x && dragStartTran.y !== newpan.y)
      setDragStartTran(newpan);
  };

  return (
    <GestureDetector gesture={drag}>
      <Animated.View
        id="animate_position"
        className="absolute"
        style={{
          transform: [
            { translateX: translation.x },
            { translateY: translation.y },
            { scale: isBeingDragged ? 1.1 : 1 },
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
          hintText={getGlyph?.(glyph)?.meanings?.primary ?? ""}
          show={isBeingDragged}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default Draggable;
