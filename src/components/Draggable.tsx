import React, { FC, useContext, useRef, useState } from "react";
import {
  AnimatableNumericValue,
  Animated,
  LayoutAnimation,
  LayoutRectangle,
  NativeModules,
  View,
  Text,
  Platform,
  ViewProps,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { DragContext, XY } from "../contexts/DragContextProvider";
import Interactable from "../displays/Interactable";

type Props = {
  children?: React.ReactNode;
} & ViewProps;

const { UIManager } = NativeModules;

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** Makes children draggable. */
const Draggable: FC<Props> = ({ children, ...props }) => {
  const dragContext = useContext(DragContext);
  const localTransform = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isBeingDragged, setIsCurrentDrag] = useState(false); // is draggable being dragging?
  const [startBound, setStartBound] = useState<LayoutRectangle>(); // Track inital size of draggable
  const [size, setCurrentSize] = useState({ height: 56, width: 56 }); // Set current size of the draggable
  let geometry = useRef<View>(null);
  const [beforeDragTransform, setBeforeDragTransform] = useState({
    x: 0,
    y: 0,
  });

  // Move to new default position
  const moveTo = (newpan: { x: number; y: number }) => {
    Animated.spring(localTransform, {
      toValue: newpan,
      useNativeDriver: true,
    }).start();
    setBeforeDragTransform(newpan);
  };

  return (
    <View {...props}>
      <PanGestureHandler
        onGestureEvent={(drag) => {
          const trans = {
            x: beforeDragTransform.x + drag.nativeEvent.translationX,
            y: beforeDragTransform.y + drag.nativeEvent.translationY,
          };
          const loc = {
            x: drag.nativeEvent.absoluteX,
            y: drag.nativeEvent.absoluteY,
          };

          // Set local translation
          localTransform.setValue(trans);

          // Set absolute position
          dragContext?.setLocation(loc);

          // Set local variables
          setIsCurrentDrag(true);
        }}
        onEnded={(_) => {
          const goalRect = dragContext?.isDroppable();
          LayoutAnimation.configureNext({
            duration: 300,
            update: { type: "spring", springDamping: 1 },
          }); // Animate next layout change

          if (goalRect && startBound) {
            const xTrans =
              goalRect.x -
              startBound.x +
              goalRect.width / 2 -
              startBound.width / 2;
            const yTrans = goalRect.y - startBound.y;
            console.log("trans", xTrans, yTrans);
            setCurrentSize({
              width: goalRect.width,
              height: goalRect.height,
            });
            moveTo({
              x: xTrans,
              y: yTrans,
            });
          } else {
            moveTo({
              x: 0,
              y: 0,
            });
            if (startBound) {
              console.log("RESET SIZE", startBound);
              setCurrentSize({
                width: startBound.width,
                height: startBound.height,
              });
            }
          }
          dragContext?.setLocation();
          setIsCurrentDrag(false);
        }}
      >
        <Animated.View
          className="self-center"
          style={{
            transform: [
              { translateX: localTransform.x },
              { translateY: localTransform.y },
            ],
            position: "relative",
            zIndex: isBeingDragged ? 10 : 1,
            elevation: isBeingDragged ? 10 : 1,
          }}
          ref={geometry}
          onLayout={(_) => {
            geometry.current?.measure((x, y, width, height, pagex, pagey) => {
              const bound = {
                x: pagex,
                y: pagey,
                width: width,
                height: height,
              };
              console.log("BOUND", bound);

              if (!startBound) setStartBound(bound);
            });
          }}
        >
          {/* <View className="bg-black h-1 w-1" /> */}
          <View style={{ height: size.height, width: size.width }}>
            {children}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Draggable;
