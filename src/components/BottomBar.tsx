import React, { FC } from 'react'
import { View } from 'react-native'
import Button, { ButtonStyles } from './Button'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated'
import { useContext } from '../utils/react'
import { ContinueAnimContext } from '../contexts/TaskAnimContextProvider'

type Props = {
    onContinue: () => boolean | undefined
    glyphWidth: number
    continueBtnText: string
    continueBtnStyle: ButtonStyles
}

/** The 'continue to next challenge' bar. */
const BottomBar: FC<Props> = ({
    onContinue,
    glyphWidth: altWidth,
    continueBtnText,
    continueBtnStyle,
}) => {
    const progress = useContext(ContinueAnimContext)

    // Animation
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    progress.value,
                    [-1, 0, 1],
                    [200, 200, 0],
                    Extrapolation.EXTEND
                ),
            },
        ],
    }))

    return (
        <Animated.View
            style={[{ aspectRatio: '20 / 7' }, animatedStyles]}
            className="  w-full h-auto py-6  mt-4"
        >
            <View
                style={{ height: 0.85714285714 * altWidth }}
                className="px-8 "
            >
                <Button
                    text={continueBtnText}
                    onPress={onContinue}
                    styleName={continueBtnStyle}
                />
            </View>
            <View
                className="absolute h-40  w-full bottom-0 -z-10"
                style={{
                    transform: [{ translateY: 150 }],
                }}
            />
            {/* ^ Hacky bottom bar that extends the bg below the screen. Does not take up any space. To ensure the spring animation does not show white at the bottom. */}
        </Animated.View>
    )
}

export default BottomBar
