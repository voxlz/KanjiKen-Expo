import React, { FC } from 'react'
import { View } from 'react-native'

import Button from './Button'
import { GlyphInfo } from '../contexts/ChallengeContextProvider'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import { useContext } from '../utils/react'

type Props = {
   chars: GlyphInfo[]
   onPress?: (glyph: GlyphInfo) => void
   idAppend?: any
}

/** Display a grid of Characters */
const CharacterGrid: FC<Props> = ({ chars, onPress, idAppend }) => {
   const glyphWidth = useContext(GlyphWidthContext)

   return (
      <View
         style={{ gap: 12 }}
         className="flex-row max-w-fullflex-shrink flex-wrap h-auto justify-center "
      >
         {chars.map((alt: GlyphInfo, i: number) => {
            return (
               <View
                  style={{
                     width: glyphWidth,
                     height: glyphWidth,
                  }}
                  key={i + alt.glyph! + idAppend}
               >
                  <Button
                     text={alt.glyph}
                     lang="jap"
                     styleName="choices"
                     onPress={() => onPress?.(alt)}
                  />
               </View>
            )
         })}
      </View>
   )
}

export default CharacterGrid
