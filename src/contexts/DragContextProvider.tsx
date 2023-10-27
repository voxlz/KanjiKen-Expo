import React, { FC, useState } from "react";
import { MeasureType } from "../components/Alternative";

export type XY = {
  x: number;
  y: number;
};

export type DropPos = {
  glyph: string;
  contains?: string; // Is something dropped here or not
} & MeasureType;

type DragContextType = {
  setLocation?: (loc?: XY) => void;
  updateDropRect?: (rect: DropPos) => void;
  resetContainsDroppable?: (glyph: string) => void; // Reset contains glyph tracking for a given glyph
  hoverDropPos?: DropPos; // What dropPos are we hovering?
};

export const DragContext = React.createContext<DragContextType>({});

/** Provides the drag context to elements that need it */
const DragContextProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [dropPositions, setDropPositions] = useState<DropPos[]>([]);
  const [hoverDropPos, setHoverDropPos] = useState<DropPos>();

  // Update droppable regions
  const updateDropRect = (dropPos: DropPos) => {
    setDropPositions((dp) => {
      if (dp) {
        const index = dp?.findIndex(
          (dp) =>
            dp.glyph === dropPos.glyph &&
            dp.x === dropPos.x &&
            dp.y === dropPos.y
        );
        if (index != -1) {
          dp[index] = dropPos;
        } else [(dp = dp.concat([dropPos]))];
        return dp;
      }
      return [dropPos];
    });
    console.log("Drop positions", dropPositions.length);
  };

  const setLocation = (loc?: XY) => {
    // setDragLocation(loc);
    setHoverDropPos(loc ? isDroppable(loc) : undefined);
  };

  // Reset 'containsDroppable' field for dropPos with matching glyph.
  // TODO might be two identical glyphs in the same kanji
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
  const isDroppable = (loc: XY) =>
    dropPositions.find(
      (rect) =>
        loc.x >= rect.x &&
        loc.x <= rect.x + rect.width &&
        loc.y >= rect.y &&
        loc.y <= rect.y + rect.height
    );

  const context = {
    setLocation,
    updateDropRect,
    resetContainsDroppable,
    hoverDropPos,
  };
  return <DragContext.Provider value={context} children={children} />;
};

export default DragContextProvider;
