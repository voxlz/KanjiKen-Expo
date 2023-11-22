import React, { FC } from 'react'
import { View } from 'react-native'
import Outline from '../displays/Outline'
import DropLocation from './DropLocation'
import { Position } from '../types/glyphDict'

type Props = {
    pos: Position | undefined
    showPositionHints: boolean
}

/**
 * Places the dropLocations in accordance with position object.
 * */
const KanjiComps: FC<Props> = ({ pos, showPositionHints }) => {
    // console.log("KANJI COMPS UPDATE");
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
                                <DropLocation text={glyph} key={j}>
                                    <Outline
                                        text={showPositionHints ? glyph : '?'}
                                    />
                                </DropLocation>
                            )
                        } else {
                            return (
                                <KanjiComps
                                    pos={strOrPos as Position}
                                    key={j}
                                    showPositionHints={showPositionHints}
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
