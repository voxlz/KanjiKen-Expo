import React, { FC, useState } from "react";
import { View } from "react-native";

type Props = { children?: React.ReactNode };

/** A view that grows to adapt whats contained in children, but then locks it's size.
 * Even if children grow or shrink later, it will remain the same size.
 */
const LockSize: FC<Props> = ({ children }) => {
  const [size, setSize] = useState<{ height: number; width: number }>();
  return (
    <View
      style={{ width: size?.width, height: size?.height }}
      children={children}
      onLayout={(e) => {
        const layout = e.nativeEvent.layout;
        setSize({ width: layout.width, height: layout.height });
      }}
    />
  );
};

export default LockSize;
