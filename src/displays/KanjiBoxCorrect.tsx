import React, { FC } from 'react'
import Animated from 'react-native-reanimated'
import { ViewStyle, StyleProp } from 'react-native'
import { font } from '../utils/fonts'
import { ContinueAnimInstantResetContext } from '../contexts/TaskAnimContextProvider'
import { useContext } from '../utils/react'

type Props = {
    text?: string
    style?: StyleProp<ViewStyle>
}

/** Box that prominently displays kanji in a "correct" / Forest styled box */
const KanjiBoxCorrect: FC<Props> = ({ text, style }) => {
    const continueAnimInstantReset = useContext(ContinueAnimInstantResetContext)

    return (
        <Animated.View
            style={style}
            className="bg-forest-200 border-forest-900 border-4 flex-grow flex-shrink rounded-xl items-center justify-center leading-none  align-text-bottom"
        >
            <Animated.Text
                style={[
                    { fontFamily: font(text, 'klee-bold') },
                    { opacity: continueAnimInstantReset },
                ]}
                className="text-8xl p-2 -mb-6"
                adjustsFontSizeToFit
            >
                {text}
            </Animated.Text>
        </Animated.View>
    )
}

export default KanjiBoxCorrect
