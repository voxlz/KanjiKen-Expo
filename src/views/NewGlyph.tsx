import React, { FC, useContext } from 'react'
import Animated from 'react-native-reanimated'
import { GetGlyphContext } from '../contexts/ChallengeContextProvider'
import { Text, View } from 'react-native'
import Button from '../components/Button'
import KanjiMeaning from '../displays/KanjiMeaning'

type Props = {
    glyphWidth: number
    onContinue: () => void
}

/**
 * The screen introducing a new glyph too the user.
 * Let's user instantly challenge themselves.
 */
const NewGlyph: FC<Props> = ({ glyphWidth, onContinue }) => {
    const getGlyph = useContext(GetGlyphContext)
    const glyphInfo = getGlyph?.()

    return (
        <View className="w-full h-full items-center justify-between">
            <View className="items-center">
                <View className="w-2/4  h-auto aspect-square">
                    <Animated.View className=" bg-forest-200 border-forest-900 border-4 flex-grow flex-shrink rounded-xl items-center justify-center leading-none  align-text-bottom	">
                        <Text
                            style={{ fontFamily: 'KleeOne_600SemiBold' }}
                            className="text-8xl p-2 -mb-6"
                            adjustsFontSizeToFit
                        >
                            {glyphInfo?.glyph}
                        </Text>
                    </Animated.View>
                </View>
                <KanjiMeaning text={glyphInfo?.meanings.primary ?? ''} />
            </View>
            <View
                style={{ height: 0.85714285714 * glyphWidth }}
                className="flex-row max-w-full flex-shrink flex-wrap h-auto px-9 flex-grow-0"
            >
                <View className="w-full ">
                    <Button text="Reveal Meaning" onPress={onContinue} />
                </View>
            </View>
        </View>
    )
}

export default NewGlyph
