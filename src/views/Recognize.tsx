import React, { FC } from 'react'
import { View, Text } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated'
import KanjiMeaning from '../displays/KanjiMeaning'
import {
    ChoicesContext,
    ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import {
    GetGlyphContext,
    SeenCountContext,
} from '../contexts/ChallengeContextProvider'
// import { useChallengeAnims } from '../animations/challengeAnims'
import { useContext } from '../utils/react'
import {
    ContinueAnimContext,
    ContinueAnimInstantResetContext,
} from '../contexts/TaskAnimContextProvider'
import Button from '../components/Button'
import { OnCorrectChoiceContext } from '../contexts/ChallengeContextProvider'
import { AddHealthContext } from '../contexts/HealthContextProvider'

type Props = { glyphWidth: number }

/** Drag components to build a glyph */
const Recognize: FC<Props> = ({ glyphWidth }) => {
    const getGlyph = useContext(GetGlyphContext)
    const seenCount = useContext(SeenCountContext)
    const choices = useContext(ChoicesContext)
    const onCorrectChoice = useContext(OnCorrectChoiceContext)
    const addHealth = useContext(AddHealthContext)
    const expectedChoice = useContext(ExpectedChoiceContext)

    // Animation values
    const animation = useContext(ContinueAnimContext)
    const animationInstantReset = useContext(ContinueAnimInstantResetContext)

    // Animation
    const builderStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animation.value,
            [-1, 0, 1],
            [1, 1, 0],
            Extrapolation.EXTEND
        ),
        transform: [
            {
                scale: interpolate(
                    animationInstantReset.value,
                    [-1, 0, 1],
                    [1, 1.2, 0.5],
                    Extrapolation.EXTEND
                ),
            },
        ],
    }))

    const kanjiStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animation.value,
            [-1, 0, 1],
            [0, 0, 1],
            Extrapolation.EXTEND
        ),
        transform: [
            {
                scale: interpolate(
                    animation.value,
                    [-1, 0, 1],
                    [0.5, 0.5, 1],
                    Extrapolation.EXTEND
                ),
            },
        ],
    }))

    const glyphInfo = getGlyph?.()

    return (
        <>
            <View className="w-2/4  h-auto aspect-square  flex-shrink flex-grow">
                <Animated.View
                    style={builderStyle}
                    className=" bg-ui-very_light border-ui-disabled border-4 absolute w-full h-full flex-grow flex-shrink rounded-xl items-center justify-center leading-none  align-text-bottom	"
                >
                    <Text
                        style={{ fontFamily: 'KleeOne_600SemiBold' }}
                        className="text-8xl p-2 -mb-6"
                        adjustsFontSizeToFit
                    >
                        {'?'}
                    </Text>
                </Animated.View>
                <Animated.View
                    style={kanjiStyle}
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
                    const isCorrectAnswer = glyphInfo?.glyph === alt.glyph
                    return (
                        <View
                            style={{ width: glyphWidth, height: glyphWidth }}
                            key={i + alt.glyph! + seenCount}
                        >
                            <Button
                                text={alt.glyph}
                                lang="jap"
                                styleName="normal"
                                onPress={() => {
                                    if (expectedChoice !== 'FINISH') {
                                        isCorrectAnswer
                                            ? onCorrectChoice?.()
                                            : addHealth(-10)
                                        return isCorrectAnswer
                                    }
                                }}
                            />
                        </View>
                    )
                })}
            </View>
        </>
    )
}

export default Recognize
