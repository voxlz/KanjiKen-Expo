import React, { Dispatch, FC, useReducer, useRef, useState } from 'react'
import { dropInfoEqual, dropsReducer } from '../reducers/dropsReducer'
import { DropInfo, XY } from '../types/dropInfo'
import { createContext as CC } from '../utils/react'

type DropsDispatchType = Dispatch<Parameters<typeof dropsReducer>[1]>
type SuccessfulDrop = (glyph: string) => DropInfo | undefined

// Create contexts
export const DropsContext = CC<DropInfo[]>()
export const DropsDispatchContext = CC<DropsDispatchType>()
export const HoverContext = CC<DropInfo>() // What dropLocation am I currently hovering?
export const WasSuccessfulDropContext = CC<SuccessfulDrop>() // What dropLocation was the element dropped on?
export const HoverUpdateContext = CC<(loc?: XY) => void>()

export let hoverRef: DropInfo | undefined // access but won't trigger rerender on change

/** Provides the drag context to elements that need it */
const DragContextProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const [drops, dropsDispatch] = useReducer(dropsReducer, [])
    const [hover, setHover] = useState<DropInfo>()

    const updateHover = (loc?: XY) => {
        const newHover = drops.find(
            (drop) =>
                loc &&
                loc.x >= drop.x &&
                loc.x <= drop.x + drop.width &&
                loc.y >= drop.y &&
                loc.y <= drop.y + drop.height
        )
        if (!dropInfoEqual(newHover, hover)) {
            // setHover(newHover);
            hoverRef = newHover
        }
    }

    const wasSuccessfulDrop = (glyph: string) => {
        if (hoverRef?.glyph === glyph) return hover
    }

    return (
        <DropsContext.Provider value={drops}>
            <DropsDispatchContext.Provider value={dropsDispatch}>
                <HoverContext.Provider value={hoverRef}>
                    <HoverUpdateContext.Provider value={updateHover}>
                        <WasSuccessfulDropContext.Provider
                            value={wasSuccessfulDrop}
                        >
                            {children}
                        </WasSuccessfulDropContext.Provider>
                    </HoverUpdateContext.Provider>
                </HoverContext.Provider>
            </DropsDispatchContext.Provider>
        </DropsContext.Provider>
    )
}

export default DragContextProvider
