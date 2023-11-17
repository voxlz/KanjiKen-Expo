import React, { FC, useEffect } from 'react'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import {
    GetGlyphContext,
    OnCorrectChoiceContext,
} from '../contexts/ChallengeContextProvider'
import { Text, View } from 'react-native'
import Button from '../components/Button'
import KanjiMeaning from '../displays/KanjiMeaning'
import { ContinueAnimInstantResetContext as SkillAnimInstantResetContext } from '../contexts/TaskAnimContextProvider'
import { useContext } from '../utils/react'
import { SeenCountContext } from '../contexts/ChallengeContextProvider'

type Props = {
    glyphWidth: number
    onContinue: () => boolean | undefined
}

/**
 * The screen introducing a new glyph too the user.
 * Let's user instantly challenge themselves.
 */
const Intro: FC<Props> = ({ glyphWidth }) => {
    const getGlyph = useContext(GetGlyphContext)
    const onCorrectChoice = useContext(OnCorrectChoiceContext)
    const skillAnim = useContext(SkillAnimInstantResetContext)
    const seenCount = useContext(SeenCountContext)
    const glyphInfo = getGlyph?.()

    const fadeAnim = useSharedValue(0)

    const textStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        transform: [
            { translateY: interpolate(fadeAnim.value, [0, 1], [50, 0]) },
        ],
    }))

    const builderStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            skillAnim.value,
            [-1, 0, 1],
            [1, 1, 1],
            Extrapolation.EXTEND
        ),
        transform: [
            {
                scale: interpolate(
                    skillAnim.value,
                    [-1, 0, 1],
                    [1, 1.2, 1],
                    Extrapolation.EXTEND
                ),
            },
        ],
    }))

    const fadeAnimInv = useDerivedValue(() => 1 - fadeAnim.value, [fadeAnim])

    const btnsStyle = useAnimatedStyle(() => ({
        opacity: fadeAnimInv.value,
    }))

    return (
        <View className="w-full h-full items-center justify-between">
            <View className="items-center">
                <View className="w-2/4  h-auto aspect-square">
                    <Animated.View
                        style={builderStyle}
                        className=" bg-ui-very_light border-ui-disabled border-4 flex-grow flex-shrink rounded-xl items-center justify-center leading-none  align-text-bottom	"
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
                <View className="items-center">
                    <Animated.View style={textStyle}>
                        <KanjiMeaning
                            text={glyphInfo?.meanings.primary ?? ''}
                        />
                    </Animated.View>
                    <Animated.View style={btnsStyle} className={'-mt-14'}>
                        <KanjiMeaning text={'New character!'} />
                    </Animated.View>
                </View>
            </View>
            <Animated.View className="-mb-10" style={btnsStyle}>
                <View
                    style={{ height: 0.85714285714 * glyphWidth }}
                    className="flex-row max-w-full flex-shrink flex-wrap h-auto px-9 flex-grow-0 mb-4"
                >
                    <View className="w-full ">
                        <Button
                            text="I might know this..."
                            styleName="secondary"
                        />
                    </View>
                </View>
                <View
                    style={{ height: 0.85714285714 * glyphWidth }}
                    className="flex-row max-w-full flex-shrink flex-wrap h-auto px-9 flex-grow-0"
                >
                    <View className="w-full ">
                        <Button
                            text="Reveal Meaning"
                            onPress={() => {
                                fadeAnim.value = withTiming(1, {
                                    duration: 300,
                                })
                                setTimeout(() => {
                                    onCorrectChoice?.()
                                }, 1000)
                            }}
                            styleName="normal"
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}

export default Intro
