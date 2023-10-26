import React, { FC, useContext, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  LayoutRectangle,
  NativeModules,
  View,
  Platform,
  ViewProps,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { DragContext } from "../contexts/DragContextProvider";

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
  const dragContext = useContext(DragContext); // Access the drag logic
  const viewRef = useRef<View>(null); // Ref to view
  const localTransform = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isBeingDragged, setIsBeingDragged] = useState(false); // is draggable being dragging?
  const [startBound, setStartBound] = useState<LayoutRectangle>(); // Remember initial size and position of this object
  const [size, setCurrentSize] = useState<{ height: number; width: number }>(); // Set current size of the draggable
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
    <View {...props} className="bg-red-400 flex-grow self-stretch flex-shrink">
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
          setIsBeingDragged(true);
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
            const newSize = {
              width: goalRect.width,
              height: goalRect.height,
            };
            const newTrans = {
              x: xTrans,
              y: yTrans,
            };
            console.log("new Trans", newTrans);
            console.log("new Size", newSize);
            setCurrentSize(newSize);
            moveTo(newTrans);
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
          setIsBeingDragged(false);
        }}
      >
        <Animated.View
          className="flex-grow"
          style={{
            transform: [
              { translateX: localTransform.x },
              { translateY: localTransform.y },
            ],
            position: "relative",
            zIndex: isBeingDragged ? 10 : 1,
            elevation: isBeingDragged ? 10 : 1,
          }}
          ref={viewRef}
          onLayout={(_) => {
            viewRef.current?.measure((x, y, width, height, pagex, pagey) => {
              const bound = {
                x: pagex,
                y: pagey,
                width: width,
                height: height,
              };

              // Set current bound only if not set before.
              setStartBound((currBound) => currBound ?? bound);
              console.log("BOUND", bound, startBound);
            });
          }}
        >
          <View
            className="flex-grow"
            style={size ? { maxHeight: size.height, maxWidth: size.width } : {}}
          >
            {children}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Draggable;
