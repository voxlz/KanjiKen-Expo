import React, { FC } from 'react'
import { View } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated'
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
    ChoicesComp,
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
                    <Animated.View
                        style={[builderStyle, { elevation: 1, zIndex: 1 }]}
                        className="flex-grow"
                    >
                        {KanjiComp}
                    </Animated.View>
                    <Animated.View
                        style={[kanjiStyle, { elevation: 0, zIndex: 0 }]}
                        className={'absolute w-full h-full -z-10'}
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
