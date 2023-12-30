import { useRef, useState } from 'react'
import { View, LayoutChangeEvent } from 'react-native'

import { LayoutType, MeasureType } from '../types/dropInfo'

/** Measure size and location of a component.
 * Just put ref and onLayout on the component youre measuring. */
export const useMeasure = (once: boolean = false) => {
   const ref = useRef<View>(null) // Ref to view
   const [measure, setMeasure] = useState<MeasureType>()

   const onLayout = () => {
      if (!once || (once && !measure))
         ref.current?.measure((x, y, width, height, pagex, pagey) => {
            const bound = {
               height,
               width,
               left: x,
               top: y,
               x: pagex,
               y: pagey,
            }
            setMeasure(bound)
         })
   }

   return { ref, measure, onLayout }
}

/** This may be worse or better, idk. */
export const useLayout = () => {
   const [layout, setLayout] = useState<LayoutType>()

   const onLayout = (event: LayoutChangeEvent) => {
      const bound = { ...event.nativeEvent.layout }
      setLayout(bound)
   }

   return { layout, onLayout }
}
