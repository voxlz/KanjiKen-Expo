import React, { FC, useContext, useEffect } from 'react'
import { Animated, ViewProps } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { ExpectedChoiceContext } from '../contexts/ChallengeContextProvider'
import Outline from '../displays/Outline'
import { useMeasure } from '../functions/useMeasure'
import { updateDrops, hoverRef } from '../globalState/DropInfo'
import { useInterval } from '../hooks/useInterval'

type Props = {
   text: string
   showPositionHints: boolean
   singleDrop?: boolean
} & ViewProps

export const dropLocationGap = 12

/** Make this component a possible drop location */
const DropLocation: FC<Props> = ({
   text: glyph,
   singleDrop,
   showPositionHints,
   ...props
}) => {
   const expectedChoice = useContext(ExpectedChoiceContext)

   const { ref, onLayout, measure } = useMeasure()

   useEffect(() => {
      if (measure)
         updateDrops({
            glyph,
            dropActual: measure,
            dropHitbox: singleDrop
               ? {
                    ...measure,
                    height: measure.height + 200,
                    width: measure.width + 200,
                    x: measure.x - 100,
                    y: measure.y - 100,
                 }
               : {
                    ...measure,
                    height: measure.height + dropLocationGap,
                    width: measure.width + dropLocationGap,
                    x: measure.x - dropLocationGap / 2,
                    y: measure.y - dropLocationGap / 2,
                 },
         })
   }, [glyph, measure, singleDrop])

   const isHovered = useSharedValue(false)
   const isNext = useSharedValue(false)

   useInterval(() => {
      isHovered.value =
         (hoverRef &&
            measure &&
            hoverRef?.dropActual.x === measure?.x &&
            hoverRef?.dropActual.y === measure?.y) === true
      isNext.value = (expectedChoice === glyph) === true
   }, 1000 / 30)

   return (
      <Animated.View
         className="flex-grow flex-shrink rounded-xl"
         {...props}
         style={[props.style]}
         ref={ref}
         onLayout={onLayout}
      >
         <Outline
            text={showPositionHints ? glyph : '?'}
            isNext={isNext}
            isHovered={isHovered}
         />
      </Animated.View>
   )
}

export default DropLocation
