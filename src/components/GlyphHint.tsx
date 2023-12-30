import React, { FC } from 'react'
import { View, Text } from 'react-native'

import { useMeasure } from '../functions/useMeasure'
import { MeasureType } from '../types/dropInfo'

type Props = {
   show: boolean
   hintText: string
   anchor: MeasureType
}

/** Hint text above the glyph component showing the primary meaning. */
const GlyphHint: FC<Props> = ({ show, hintText, anchor }) => {
   const {
      measure: text,
      onLayout: textOnLayout,
      ref: textContRef,
   } = useMeasure()

   return (
      <View
         style={{
            opacity: show ? 1 : 0,
            left: anchor.left - ((text?.width ?? 0) - anchor.width) / 2,
            top: anchor.top - (text?.height ?? 0) - 10,
            width: show ? text?.width ?? 1000 : 0,
            height: show ? text?.height : 0,
            pointerEvents: 'none',
         }}
         className="absolute w-32 h-16 z-20"
      >
         <View
            id="hint"
            ref={textContRef}
            onLayout={() => {
               if (show) textOnLayout()
            }}
            className="bg-ui-very_light  self-start rounded-lg border-ui-disabled border-2"
         >
            <Text className="mx-4 my-3 text-xl capitalize">{hintText}</Text>
         </View>
         <View
            style={{
               left: (text?.width ?? 0) / 2 - 10,
               top: 0,
            }}
            className="w-0 h-0 border-transparent border-t-[10px] border-b-0 border-x-[10px] border-t-ui-disabled"
         />
      </View>
   )
}

export default GlyphHint
