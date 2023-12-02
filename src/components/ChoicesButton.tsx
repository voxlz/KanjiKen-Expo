import { FC } from 'react'
import {
    GlyphInfo,
    SeenCountContext,
    ChoicesContext,
    OnCorrectChoiceContext,
    ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import { AddHealthContext } from '../contexts/HealthContextProvider'
import { useContext } from '../utils/react'
import CharacterGrid from './CharacterGrid'

const ChoicesButtons: FC<{ glyphInfo: GlyphInfo }> = ({ glyphInfo }) => {
    const seenCount = useContext(SeenCountContext)
    const choices = useContext(ChoicesContext)
    const onCorrectChoice = useContext(OnCorrectChoiceContext)
    const addHealth = useContext(AddHealthContext)
    const expectedChoice = useContext(ExpectedChoiceContext)

    const onPress = (alt: GlyphInfo) => {
        const isCorrectAnswer = glyphInfo?.glyph === alt.glyph
        if (expectedChoice !== 'FINISH') {
            isCorrectAnswer ? onCorrectChoice?.() : addHealth(-10)
            return isCorrectAnswer
        }
    }

    return (
        <CharacterGrid chars={choices} onPress={onPress} idAppend={seenCount} />
    )
}

export default ChoicesButtons
