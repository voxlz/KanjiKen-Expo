import React, { FC } from 'react'
import { View } from 'react-native'

import Choice from './Choice'
import {
   SeenCountContext,
   ChoicesContext,
} from '../contexts/ChallengeContextProvider'
import { Learnable } from '../types/progress'
import { defaultGap } from '../utils/consts'
import { useContext } from '../utils/react'

type Props = {
   hintOnDrag: boolean
   isCorrectAnswer: (glyph: Learnable) => boolean
}

/** Bottom row of dragable choices buttons, used in kanjiExcersiseTemplate */
const DraggableChoicesButtons: FC<Props> = ({
   hintOnDrag,
   isCorrectAnswer,
}) => {
   const choices = useContext(ChoicesContext)
   const seenCount = useContext(SeenCountContext)
   return (
      <View
         style={{ gap: defaultGap }}
         className="flex-row max-w-full flex-shrink flex-wrap h-auto px-8"
      >
         {choices?.map((alt, i) => {
            return (
               <Choice
                  key={alt.glyph + i + seenCount}
                  altInfo={alt}
                  isCorrectAnswer={isCorrectAnswer(alt.glyph)}
                  hintOnDrag={hintOnDrag}
               />
            )
         })}
      </View>
   )
}

export default DraggableChoicesButtons
