import React, { FC, useState } from "react";
import { LayoutRectangle } from "react-native";

type Props = { children?: React.ReactNode };

export type XY = {
  x: number;
  y: number;
};

export type DropRect = {
  glyph: string;
} & LayoutRectangle;

type DragContextType = {
  dragLocation?: XY;
  setLocation: (loc?: XY) => void;
  dropRects: DropRect[];
  updateDropRect: (rect: DropRect) => void;
  isDroppable: () => DropRect | undefined;
};

export const DragContext = React.createContext<DragContextType | undefined>(
  undefined
);

/** Provides the drag context to elements that need it */
const DragContextProvider: FC<Props> = ({ children }) => {
  const [dragLocation, setLocation] = useState<XY>();
  const [dropRects, setDropRects] = useState<DropRect[]>([]);

  // Update droppable regions
  const updateDropRect = (rect: DropRect) => {
    setDropRects((dropRects) => {
      if (dropRects) {
        const index = dropRects?.indexOf(rect);
        if (index != -1) {
          dropRects[index] = rect;
        } else [(dropRects = dropRects.concat([rect]))];
        return dropRects;
      }
      return [rect];
    });
  };

  /** Is the currently dragged object droppable on a certain rect? Return if so. */
  const isDroppable = () => {
    return dropRects.find((rect) => {
      if (dragLocation) {
        if (dragLocation.x >= rect.x && dragLocation.x <= rect.x + rect.width) {
          if (
            dragLocation.y >= rect.y &&
            dragLocation.y <= rect.y + rect.height
          ) {
            console.log("droppable", dragLocation, rect);
            return true;
          }
        }
      }
    });
  };

  const context = {
    dragLocation: dragLocation,
    setLocation: setLocation,
    updateDropRect: updateDropRect,
    dropRects: dropRects,
    isDroppable,
  };
  return <DragContext.Provider value={context} children={children} />;
};

export default DragContextProvider;
