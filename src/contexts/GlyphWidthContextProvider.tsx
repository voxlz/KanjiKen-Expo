import React, { FC, ReactNode } from 'react'
import { useWindowDimensions } from 'react-native'

import { createContext } from '../utils/react'

export const GlyphWidthContext = createContext<number>()

const GlyphWidthContextProvider: FC<{ children?: ReactNode }> = ({
   children,
}) => {
   const { width } = useWindowDimensions()
   const margin = 32 * 2
   const gap = 3 * 12
   const glyphWidth = (width - margin - gap) / 4
   return (
      <GlyphWidthContext.Provider value={glyphWidth}>
         {children}
      </GlyphWidthContext.Provider>
   )
}
export default GlyphWidthContextProvider
