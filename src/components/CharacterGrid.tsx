import React, { FC } from 'react'
import { GlyphInfo } from '../contexts/ChallengeContextProvider'
import { View } from 'react-native'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import { useContext } from '../utils/react'
import Button from './Button'

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
            style={{ gap: 8 }}
            className="flex-row max-w-fullflex-shrink flex-wrap h-auto"
        >
            {chars.map((alt: GlyphInfo, i: number) => {
                return (
                    <View
                        style={{
                            width: (glyphWidth * 8) / 10,
                            height: (glyphWidth * 8) / 10,
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
