import React, { FC, useContext } from 'react'
import { View, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import Alternative from '../components/Alternative'
import KanjiComps from '../components/KanjiComps'
import KanjiMeaning from '../displays/KanjiMeaning'
import {
    ChoicesContext,
    ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import {
    GetGlyphContext,
    SeenCountContext,
} from '../contexts/ChallengeContextProvider'
import { useChallengeAnims } from '../animations/challengeAnims'

type Props = { glyphWidth: number }

/** Drag components to build a glyph */
const Compose: FC<Props> = ({ glyphWidth }) => {
    const getGlyph = useContext(GetGlyphContext)
    const seenCount = useContext(SeenCountContext)
    const expectedChoice = useContext(ExpectedChoiceContext)
    const choices = useContext(ChoicesContext)

    const { builderScale, kanjiScale, opacity, invertedOpacity } =
        useChallengeAnims()

    const glyphInfo = getGlyph?.()

    return (
        <>
            <View className="w-2/4  h-auto aspect-square  flex-shrink flex-grow">
                <Animated.View
                    style={{
                        gap: 12,
                        opacity: opacity,
                        transform: [{ scale: builderScale }],
                    }}
                    className="flex-grow"
                >
                    <KanjiComps
                        pos={glyphInfo?.comps.position}
                        key={seenCount}
                    />
                </Animated.View>
                <Animated.View
                    style={{
                        opacity: invertedOpacity,
                        transform: [{ scale: kanjiScale }],
                    }}
                    className=" bg-forest-200 border-forest-900 border-4 absolute w-full h-full flex-grow flex-shrink rounded-xl items-center justify-center leading-none  align-text-bottom	"
                >
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
            <View style={{ flexGrow: 2 }} />
            <View
                style={{ gap: 12 }}
                className="flex-row max-w-full flex-shrink flex-wrap h-auto px-9"
            >
                {choices?.map((alt, i) => {
                    const isCorrectAnswer = glyphInfo?.comps.order.includes(
                        alt.glyph!
                    )
                    return (
                        <Alternative
                            key={i + alt.glyph! + seenCount}
                            altInfo={alt}
                            dragOpacity={isCorrectAnswer ? opacity : undefined}
                            dragScale={
                                isCorrectAnswer ? builderScale : undefined
                            }
                            width={glyphWidth}
                            expectedChoice={expectedChoice}
                        />
                    )
                })}
            </View>
        </>
    )
}

export default Compose
