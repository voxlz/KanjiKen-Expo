import React, { FC, useState } from "react";
import { MeasureType } from "../components/Alternative";

type Props = { children?: React.ReactNode };

export type XY = {
  x: number;
  y: number;
};

export type DropPos = {
  glyph: string;
  contains?: string; // Is something dropped here or not
} & MeasureType;

type DragContextType = {
  dragLocation?: XY;
  setLocation?: (loc?: XY) => void;
  dropPositions?: DropPos[];
  updateDropRect?: (rect: DropPos) => void;
  isDroppable?: () => DropPos | undefined;
  resetContainsDroppable?: (glyph: string) => void;
};

export const DragContext = React.createContext<DragContextType>({});

/** Provides the drag context to elements that need it */
const DragContextProvider: FC<Props> = ({ children }) => {
  const [dragLocation, setLocation] = useState<XY>();
  const [dropPositions, setDropPositions] = useState<DropPos[]>([]);

  // Update droppable regions
  const updateDropRect = (dropPos: DropPos) => {
    setDropPositions((dp) => {
      if (dp) {
        const index = dp?.indexOf(dropPos);
        if (index != -1) {
          dp[index] = dropPos;
        } else [(dp = dp.concat([dropPos]))];
        return dp;
      }
      return [dropPos];
    });
  };

  // Reset 'containsDroppable' field for dropPos with matching glyph.
  const resetContainsDroppable = (glyph: string) => {
    setDropPositions((dropPositions) =>
      dropPositions.map((dropPos) => {
        dropPos.contains =
          dropPos.contains === glyph ? undefined : dropPos.contains;
        return dropPos;
      })
    );
  };

  /** Is the currently dragged object droppable on a certain rect? Return if so. */
  const isDroppable = () => {
    return dropPositions.find((rect) => {
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
    dragLocation,
    setLocation,
    updateDropRect,
    dropPositions,
    isDroppable,
    resetContainsDroppable,
  };
  return <DragContext.Provider value={context} children={children} />;
};

export default DragContextProvider;
