import React, {
  Dispatch,
  FC,
  createContext as cc,
  useReducer,
  useRef,
  useState,
} from "react";
import { dropInfoEqual, dropsReducer } from "../reducers/dropsReducer";
import { DropInfo, XY } from "../types/dropInfo";

type dropsDispatch = Dispatch<Parameters<typeof dropsReducer>[1]>;

// Create contexts
export const DropsContext = cc<DropInfo[]>([]);
export const DropsDispatchContext = cc<dropsDispatch | undefined>(undefined);
export const HoverContext = cc<DropInfo | undefined>(undefined);
export const HoverUpdateContext = cc<((loc?: XY) => void) | undefined>(
  undefined
);

/** Provides the drag context to elements that need it */
const DragContextProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [drops, dropsDispatch] = useReducer(dropsReducer, []);
  const [hover, setHover] = useState<DropInfo>();
  let hoverRef = useRef<DropInfo>().current; // access but won't trigger rerender on change

  const updateHover = (loc?: XY) => {
    const newHover = drops.find(
      (drop) =>
        loc &&
        loc.x >= drop.x &&
        loc.x <= drop.x + drop.width &&
        loc.y >= drop.y &&
        loc.y <= drop.y + drop.height
    );
    if (!dropInfoEqual(newHover, hover)) {
      setHover(newHover);
      hoverRef = newHover;
    }
  };

  return (
    <DropsContext.Provider value={drops}>
      <DropsDispatchContext.Provider value={dropsDispatch}>
        <HoverContext.Provider value={hover}>
          <HoverUpdateContext.Provider value={updateHover}>
            {children}
          </HoverUpdateContext.Provider>
        </HoverContext.Provider>
      </DropsDispatchContext.Provider>
    </DropsContext.Provider>
  );
};

export default DragContextProvider;
