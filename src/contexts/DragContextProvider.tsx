import React, { FC, useState } from "react";
import { MeasureType } from "../components/Alternative";

export type XY = {
  x: number;
  y: number;
};

export type DropPos = {
  glyph: string;
  containsGlyph?: string; // Is something already dropped here or not
} & MeasureType;

export const DragContext = React.createContext<{
  setLocation?: (loc?: XY) => void;
  updateDropRect?: (rect: DropPos) => void;
  resetContainsDroppable?: (glyph: string) => void; // Reset contains glyph tracking for a given glyph
  hoverDropPos?: DropPos; // What dropPos are we hovering?
  clearDropContext?: () => void; // Clear drop rects, usually between exercises
}>({});

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
  };

  const clearDropContext = () => {
    setDropPositions([]);
    setLocation();
    resetContainsDroppable();
    setHoverDropPos(undefined);
  };

  /** Set the current dragLocation, which will update dropPos */
  const setLocation = (loc?: XY) => {
    const dropPos = loc ? isDroppable(loc) : undefined;
    if (dropPos !== hoverDropPos) setHoverDropPos(dropPos);
  };

  // Reset 'containsDroppable' field for dropPos with matching glyph.
  // TODO might be two identical glyphs in the same kanji
  const resetContainsDroppable = (glyph?: string) => {
    setDropPositions((dropPositions) =>
      dropPositions.map((dropPos) => {
        if (glyph) {
          dropPos.containsGlyph =
            dropPos.containsGlyph === glyph ? undefined : dropPos.containsGlyph;
        } else {
          dropPos.containsGlyph = undefined;
        }
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
    clearDropContext,
  };
  return <DragContext.Provider value={context} children={children} />;
};

export default DragContextProvider;
