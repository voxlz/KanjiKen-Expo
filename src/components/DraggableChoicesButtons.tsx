import React, { FC } from 'react'
import { View } from 'react-native'
import Choice from './Choice'
import { defaultGap } from '../utils/consts'
import { useContext } from '../utils/react'
import {
    SeenCountContext,
    ChoicesContext,
} from '../contexts/ChallengeContextProvider'
import { Learnable } from '../types/progress'

type Props = {
    clickable: boolean
    hintOnDrag: boolean
    isCorrectAnswer: (glyph: Learnable) => boolean
}

/** Bottom row of dragable choices buttons, used in kanjiExcersiseTemplate */
const DraggableChoicesButtons: FC<Props> = ({
    clickable,
    hintOnDrag,
    isCorrectAnswer,
}) => {
    const choices = useContext(ChoicesContext)
    const seenCount = useContext(SeenCountContext)
    return (
        <View
            style={{ gap: defaultGap }}
            className="flex-row max-w-full flex-shrink flex-wrap h-auto px-8"
        >
            {choices?.map((alt, i) => {
                return (
                    <Choice
                        key={alt.glyph + i + seenCount}
                        altInfo={alt}
                        isCorrectAnswer={isCorrectAnswer(alt.glyph)}
                        clickable={clickable}
                        hintOnDrag={hintOnDrag}
                    />
                )
            })}
        </View>
    )
}

export default DraggableChoicesButtons