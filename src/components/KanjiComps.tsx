import React, { FC } from 'react'
import { View } from 'react-native'

import DropLocation from './DropLocation'
import { Position } from '../types/glyphDict'

type Props = {
   pos: Position | undefined
   showPositionHints: boolean
   singleComp?: boolean
}

/**
 * Places drop locations in accordance with position object in glyphDict.
 * */
const KanjiComps: FC<Props> = ({ pos, showPositionHints, singleComp }) => {
   return (
      <View className="flex-grow flex-shrink">
         {Object.entries(pos ?? {}).map(([key, value], i) => (
            <View
               style={{ gap: 12 }}
               className={
                  'flex-grow flex-shrink ' +
                  (key.startsWith('col') ? '' : 'flex-row')
               }
               key={i}
            >
               {value.map((strOrPos, j) => {
                  if (typeof strOrPos === 'string') {
                     const glyph = strOrPos.replace('?', '')
                     return (
                        <DropLocation
                           text={glyph}
                           key={j}
                           singleDrop={singleComp}
                           showPositionHints={showPositionHints}
                        />
                     )
                  } else {
                     return (
                        <KanjiComps
                           pos={strOrPos as Position}
                           key={j}
                           showPositionHints={showPositionHints}
                           singleComp={singleComp}
                        />
                     )
                  }
               })}
            </View>
         ))}
      </View>
   )
}

export default KanjiComps
