import React, { FC, useContext, useEffect, useRef } from 'react'
import { Animated, ViewProps } from 'react-native'

import { ExpectedChoiceContext } from '../contexts/ChallengeContextProvider'
import { useMeasure } from '../functions/useMeasure'
import { updateDrops, hoverRef } from '../globalState/DropInfo'

type Props = {
   children: React.ReactNode
   text: string
   singleDrop?: boolean
} & ViewProps

export const dropLocationGap = 12

/** Make this component a possible drop location */
const DropLocation: FC<Props> = ({ children, text, singleDrop, ...props }) => {
   const expectedChoice = useContext(ExpectedChoiceContext)

   const { ref, onLayout, measure } = useMeasure()

   useEffect(() => {
      if (measure)
         updateDrops({
            glyph: text,
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
   }, [measure])

   // BACKGROUND COLOR - Does not currently work
   const colorIndex = useRef(new Animated.Value(0)).current
   const bgColor = colorIndex.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
         'rgba(255, 255, 255, 1)', // default
         'rgba(243, 244, 246, 1)', // next
         'rgba(238, 244, 250, 1)', // hover
      ],
   })
   const isHovered =
      hoverRef &&
      measure &&
      hoverRef?.dropActual.x === measure?.x &&
      hoverRef?.dropActual.y === measure?.y
   const isNext = expectedChoice === text
   colorIndex.setValue(isHovered ? 1 : isNext ? 2 : 0)

   return (
      // <HelpBox meaning={meaning}>
      <Animated.View
         className="flex-grow flex-shrink rounded-xl"
         {...props}
         style={[props.style, { backgroundColor: bgColor }]}
         ref={ref}
         onLayout={onLayout}
      >
         {children}
      </Animated.View>
      // </HelpBox>
   )
}

export default DropLocation
