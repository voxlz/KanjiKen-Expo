import React, { FC } from 'react'
import { View } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated'
import Alternative from '../components/Alternative'
import KanjiComps from '../components/KanjiComps'
import KanjiMeaning from '../displays/KanjiMeaning'
import { useContext } from '../utils/react'
import {
    ContinueAnimContext,
    ContinueAnimInstantResetContext,
} from '../contexts/TaskAnimContextProvider'

type Props = {
    KanjiComp: React.ReactNode
    KanjiSuccComp?: React.ReactNode
    TextComp: React.ReactNode
    TextSuccComp?: React.ReactNode
    ChoicesComp: React.ReactNode
    ChoicesSuccComp?: React.ReactNode
}

/** A template for kanji skills */
const KanjiSkillTemplate: FC<Props> = ({
    KanjiComp,
    KanjiSuccComp,
    TextComp,
    TextSuccComp,
    ChoicesComp,
    ChoicesSuccComp,
}) => {
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

    return (
        <View className="items-center justify-between flex-grow">
            <View className="items-center">
                <View className="w-2/4 aspect-square">
                    <Animated.View style={[builderStyle]} className="flex-grow">
                        {KanjiComp}
                    </Animated.View>
                    <Animated.View
                        style={kanjiStyle}
                        className={'absolute  w-full h-full'}
                    >
                        {KanjiSuccComp}
                    </Animated.View>
                </View>
                {TextComp}
            </View>
            <View>{ChoicesComp}</View>
        </View>
    )
}

export default KanjiSkillTemplate
