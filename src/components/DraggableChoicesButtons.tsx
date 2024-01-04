import React, { FC } from 'react'
import { View } from 'react-native'

import Choice from './Choice'
import {
   SeenCountContext,
   ChoicesContext,
} from '../contexts/ChallengeContextProvider'
import { defaultGap } from '../utils/consts'
import { useContext } from '../utils/react'

type Props = {
   hintOnDrag: boolean
}

/** Bottom row of dragable choices buttons, used in kanjiExcersiseTemplate */
const DraggableChoicesButtons: FC<Props> = ({ hintOnDrag }) => {
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
                  hintOnDrag={hintOnDrag}
               />
            )
         })}
      </View>
   )
}

export default DraggableChoicesButtons
