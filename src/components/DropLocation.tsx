import React, { FC, useContext, useRef } from "react";
import { View, ViewProps } from "react-native";
import { DragContext } from "../contexts/DragContextProvider";

type Props = {
  children: React.ReactNode;
  text: string;
} & ViewProps;

/** Make this component a possible drop location */
const DropLocation: FC<Props> = ({ children, text, ...props }) => {
  const dragContext = useContext(DragContext);
  let geometry = useRef<View>(null);
  return (
    <View
      className="self-stretch flex-grow"
      {...props}
      style={[
        {
          backgroundColor:
            dragContext?.isDroppable()?.glyph === text ? "blue" : undefined,
        },
        props.style,
      ]}
      ref={geometry}
      onLayout={(_) => {
        geometry.current?.measure((x, y, width, height, pagex, pagey) => {
          const dropRect = {
            x: pagex,
            y: pagey,
            width: width,
            height: height,
            glyph: text,
          };
          console.log(dropRect);
          dragContext?.updateDropRect(dropRect);
        });
      }}
    >
      {children}
    </View>
  );
};

export default DropLocation;
