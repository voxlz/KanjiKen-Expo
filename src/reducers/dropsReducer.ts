// Keep track of drop locations

import { DropInfo } from "../types/dropInfo";

export const dropInfoEqual = (newInfo?: DropInfo, oldInfo?: DropInfo) => {
  if (newInfo && oldInfo)
    return (
      newInfo.glyph === oldInfo.glyph &&
      newInfo.x === oldInfo.x &&
      newInfo.y === oldInfo.y
    );
  return false;
};

export const dropsReducer = (
  dropInfoArr: DropInfo[],
  action: { type: "changed" | "clear"; dropInfo?: DropInfo }
) => {
  switch (action.type) {
    case "changed": {
      const newInfo = action.dropInfo;
      if (!newInfo) {
        console.warn("changed called without value");
        return dropInfoArr;
      }
      const idx = dropInfoArr.findIndex((oldInfo) =>
        dropInfoEqual(newInfo, oldInfo)
      );
      return idx != -1
        ? dropInfoArr.map((oldInfo, i) => (i === idx ? newInfo : oldInfo))
        : [...dropInfoArr, newInfo];
    }
    case "clear": {
      return [];
    }
  }
};
