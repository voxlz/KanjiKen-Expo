import { FC } from 'react'
import { View } from 'react-native'
import {
    GlyphInfo,
    SeenCountContext,
    ChoicesContext,
    OnCorrectChoiceContext,
    ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import { AddHealthContext } from '../contexts/HealthContextProvider'
import { useContext } from '../utils/react'
import Button from './Button'

const ChoicesButtons: FC<{ glyphInfo: GlyphInfo; glyphWidth: number }> = ({
    glyphInfo,
    glyphWidth,
}) => {
    const seenCount = useContext(SeenCountContext)
    const choices = useContext(ChoicesContext)
    const onCorrectChoice = useContext(OnCorrectChoiceContext)
    const addHealth = useContext(AddHealthContext)
    const expectedChoice = useContext(ExpectedChoiceContext)

    return (
        <View
            style={{
                gap: 12,
            }}
            className="flex-row max-w-full flex-shrink flex-wrap h-auto px-8"
        >
            {choices?.map((alt: { glyph: string | undefined }, i: any) => {
                const isCorrectAnswer = glyphInfo?.glyph === alt.glyph
                return (
                    <View
                        style={{
                            width: glyphWidth,
                            height: glyphWidth,
                        }}
                        key={i + alt.glyph! + seenCount}
                    >
                        <Button
                            text={alt.glyph}
                            lang="jap"
                            styleName="choices"
                            onPress={() => {
                                if (expectedChoice !== 'FINISH') {
                                    isCorrectAnswer
                                        ? onCorrectChoice?.()
                                        : addHealth(-10)
                                    return isCorrectAnswer
                                }
                            }}
                        />
                    </View>
                )
            })}
        </View>
    )
}

export default ChoicesButtons
