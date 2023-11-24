import React, { FC, useContext } from 'react'
import { View, Pressable } from 'react-native'
import SVGImg from '../../assets/ph_x-circle-duotone.svg'
import {
    RelativeHealthContext,
    HealthColorContext,
} from '../contexts/HealthContextProvider'
import Animated, {
    interpolateColor,
    useAnimatedStyle,
} from 'react-native-reanimated'
import { router } from 'expo-router'

type Props = {
    glyphWidth: number // 1/3th height of alt component
}

/** Keeps track of current health */
const HealthBar: FC<Props> = ({ glyphWidth: altWidth }) => {
    const relativeHealth = useContext(RelativeHealthContext)
    const healthColor = useContext(HealthColorContext)

    const height = altWidth / 3

    const healthBarStyle = useAnimatedStyle(() => {
        if (healthColor && relativeHealth) {
            const healthLight = interpolateColor(
                healthColor.value,
                [0, 1],
                ['rgba(228, 106, 106, 1)', 'rgba(204, 232, 174, 1)']
            )
            return {
                backgroundColor: healthLight,
                height: height - 6,
                width: `${relativeHealth.value}%`,
            }
        } else return {}
    })

    const healthBackground = useAnimatedStyle(() => {
        if (healthColor && relativeHealth) {
            const background = interpolateColor(
                healthColor.value,
                [0, 1],
                ['#B03A3A', 'rgba(83, 136, 40, 1)']
            )
            const border = interpolateColor(
                healthColor.value,
                [0, 1],
                ['#6C2424', '#46622F']
            )
            return {
                backgroundColor: background,
                borderColor: border,
                borderRadius: 9,
                height: height,
                flexGrow: 1,
            }
        } else return {}
    })

    return (
        <View style={{ gap: 12 }} className="flex-row px-8  items-center">
            <Animated.View
                style={healthBackground}
                className="flex-grow  border-[3px] items-end justify-center"
            >
                {/* <Text className=" text-forest-200">300</Text> */}
                <Animated.View
                    style={healthBarStyle}
                    className="absolute rounded-md items-end justify-center inset-3 self-start"
                >
                    {/* <Text className="text-forest-800">200</Text> */}
                </Animated.View>
            </Animated.View>
            <Pressable onPress={() => router.back()}>
                <SVGImg width={height * 1.6} height={height * 1.6} />
            </Pressable>
        </View>
    )
}

export default HealthBar
