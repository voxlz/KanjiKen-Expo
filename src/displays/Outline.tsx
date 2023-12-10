import { Text, StyleProp, ViewStyle } from 'react-native'
import React, { FC } from 'react'
import Animated from 'react-native-reanimated'

type Props = {
    text?: string
    style?: StyleProp<ViewStyle>
    dashed?: boolean
}

const Outline: FC<Props> = ({ text, style, dashed = true }) => {
    return (
        <Animated.View
            style={[
                style,
                {
                    // Tailwind utils break dashed border on android
                    borderStyle: dashed ? 'dashed' : 'solid',
                    borderWidth: 3,
                    borderRadius: 12,
                    borderColor: 'rgb(174, 174, 174)',
                },
            ]}
            className="flex-grow flex-shrink bg-none items-center justify-center"
        >
            <Text
                style={{ fontFamily: text !== '?' ? 'klee-bold' : undefined }}
                className="text-center text-ui-disabled text-4xl leading-none"
            >
                {text}
            </Text>
        </Animated.View>
    )
}

export default Outline
