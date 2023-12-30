import React, { FC, useState } from 'react'
import { View, Pressable } from 'react-native'

import Draggable from './Draggable'
import {
   ExpectedChoiceContext,
   GlyphInfo,
} from '../contexts/ChallengeContextProvider'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import Interactable from '../displays/Interactable'
import Outline from '../displays/Outline'
import { useMeasure } from '../functions/useMeasure'
import { useContext } from '../utils/react'

type Props = {
   altInfo: GlyphInfo
   isCorrectAnswer: boolean
   hintOnDrag: boolean
}

/** Draggable on top of an outline */
const Choice: FC<Props> = ({ altInfo, isCorrectAnswer, hintOnDrag }) => {
   const glyphWidth = useContext(GlyphWidthContext)
   // const expectedChoice = useContext(ExpectedChoiceContext)

   const glyph = altInfo.glyph
   const { measure: anchor, onLayout, ref } = useMeasure()
   const [, setShow] = useState(false)
   const [isBeingDragged, setIsBeingDragged] = useState(false) // is draggable being dragging?

   return (
      <View
         className="aspect-square flex-grow flex-shrink z-0"
         style={{ width: glyphWidth, zIndex: isBeingDragged ? 30 : 10 }}
      >
         {/* ----------- Outline - Bottom layer-------------- */}
         <Pressable
            className="aspect-square flex-grow flex-shrink basis-1/5 z-0"
            style={{ width: glyphWidth }}
            ref={ref}
            onLayout={onLayout}
            onPress={() => setShow((state) => !state)}
         >
            <Outline text={glyph} />
         </Pressable>

         {/* ------------- Interactable - Middle layer --------------*/}

         <View
            // I don't remember why this is here
            // style={{
            //     pointerEvents:
            //         isCorrectAnswer && expectedChoice === 'FINISH'
            //             ? 'none'
            //             : 'auto',
            // }}
            className="absolute z-20"
         >
            <Draggable
               anchor={anchor}
               // width={glyphWidth}
               glyph={glyph}
               isCorrectAnswer={isCorrectAnswer}
               isBeingDragged={isBeingDragged}
               setIsBeingDragged={setIsBeingDragged}
               hintOnDrag={hintOnDrag}
            >
               <Interactable text={glyph} />
            </Draggable>
         </View>

         {/* ------------ Help box - Top Layer -------------- */}
         {/* {anchor && <GlyphHint anchor={anchor} hintText={meaning} show={show} />} */}
      </View>
   )
}

export default Choice
