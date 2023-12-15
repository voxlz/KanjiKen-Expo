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
import StyledButton from './StyledButton'

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
            style={[animatedStyles]}
            className="w-full py-6   mb-4 justify-end"
        >
            <View className="px-8">
                <StyledButton
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
