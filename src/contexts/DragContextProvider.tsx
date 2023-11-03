import React, { FC, useState } from "react";
import { MeasureType } from "../components/Alternative";

export type XY = {
  x: number;
  y: number;
};

export type DropInfo = {
  glyph: string;
  containsGlyph?: string; // Is something already dropped here or not
} & MeasureType;

type DragContextType = {
  setDragLoc: (loc?: XY) => void;
  updateDropInfo: (info: DropInfo) => void;
  hoverDropInfo: DropInfo | undefined; // What dropPos are we hovering?
  getDropInfo: (glyph: string) => DropInfo | undefined;
  resetContainsDroppable: (glyph: string) => void; // Reset contains glyph tracking for a given glyph
  clearDropContext: () => void; // Clear drop rects, usually between exercises
};

export const DragContext = React.createContext<DragContextType>({
  setDragLoc(loc) {
    console.log("not implemented");
  },
  updateDropInfo(info) {
    console.log("not implemented");
  },
  clearDropContext() {
    console.log("not implemented");
  },
  getDropInfo(glyph) {
    console.log("not implemented");
    return undefined;
  },
  resetContainsDroppable(glyph) {
    console.log("not implemented");
  },
  hoverDropInfo: undefined,
});

/** Provides the drag context to elements that need it */
const DragContextProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [dropInfoArr, setDropPositions] = useState<DropInfo[]>([]);
  const [hoverDropInfo, setHoverDropPos] = useState<DropInfo>();

  // Get specific drop info.
  const getDropInfo = (glyph: string) => {
    return dropInfoArr.find((info) => info.glyph === glyph);
  };

  // Update droppable regions
  const updateDropInfo = (dropPos: DropInfo) => {
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
    setDragLoc();
    resetContainsDroppable();
    setHoverDropPos(undefined);
  };

  /** Set the current dragLocation, which will update dropPos */
  const setDragLoc = (loc?: XY) => {
    const dropPos = loc ? isDroppable(loc) : undefined;
    // if (dropPos !== hoverDropInfo) setHoverDropPos(dropPos);
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
    dropInfoArr.find(
      (rect) =>
        loc.x >= rect.x &&
        loc.x <= rect.x + rect.width &&
        loc.y >= rect.y &&
        loc.y <= rect.y + rect.height
    );

  const context = {
    setDragLoc,
    updateDropInfo,
    resetContainsDroppable,
    hoverDropInfo,
    clearDropContext,
    getDropInfo,
  } as DragContextType;

  return <DragContext.Provider value={context} children={children} />;
};

export default DragContextProvider;
