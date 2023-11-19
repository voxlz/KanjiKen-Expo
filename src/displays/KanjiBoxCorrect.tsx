import React, { FC } from 'react'
import Animated from 'react-native-reanimated'
import { View, Text, ViewStyle, StyleProp } from 'react-native'
import { font } from '../utils/fonts'

type Props = {
    text?: string
    style?: StyleProp<ViewStyle>
}

/** Box that prominently displays kanji in a "correct" / Forest styled box */
const KanjiBoxCorrect: FC<Props> = ({ text, style }) => (
    <Animated.View
        style={style}
        className=" bg-forest-200 border-forest-900 border-4 flex-grow flex-shrink rounded-xl items-center justify-center leading-none  align-text-bottom	"
    >
        <Text
            style={{ fontFamily: font(text) }}
            className="text-8xl p-2 -mb-6"
            adjustsFontSizeToFit
        >
            {text}
        </Text>
    </Animated.View>
)

export default KanjiBoxCorrect
