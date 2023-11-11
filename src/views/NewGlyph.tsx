import React, { FC, useContext, useEffect } from 'react'
import Animated, {
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

type Props = {
    glyphWidth: number
    onContinue: () => boolean | undefined
}

/**
 * The screen introducing a new glyph too the user.
 * Let's user instantly challenge themselves.
 */
const NewGlyph: FC<Props> = ({ glyphWidth }) => {
    const getGlyph = useContext(GetGlyphContext)
    const onCorrectChoice = useContext(OnCorrectChoiceContext)
    const glyphInfo = getGlyph?.()

    const fadeAnim = useSharedValue(0)
    const textStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }))

    useEffect(() => {
        fadeAnim.value = 0
    }, [glyphInfo])

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
                <View>
                    <Animated.View style={textStyle}>
                        <KanjiMeaning
                            text={glyphInfo?.meanings.primary ?? ''}
                        />
                    </Animated.View>
                    <Animated.View
                        style={{
                            opacity: useDerivedValue(() => 1 - fadeAnim.value),
                            position: 'absolute',
                        }}
                    >
                        <KanjiMeaning text={'New character!'} />
                    </Animated.View>
                </View>
            </View>
            <Animated.View
                className="-mb-14"
                style={{
                    opacity: useDerivedValue(() => 1 - fadeAnim.value),
                }}
            >
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
                                setTimeout(() => onCorrectChoice?.(), 1500)
                            }}
                            styleName="normal"
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}

export default NewGlyph
