import React, { FC } from 'react'
import KanjiMeaning from '../displays/KanjiMeaning'
import {
    ChoicesContext,
    ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import {
    GetGlyphContext,
    SeenCountContext,
} from '../contexts/ChallengeContextProvider'
import { useContext } from '../utils/react'
import { OnCorrectChoiceContext } from '../contexts/ChallengeContextProvider'
import { AddHealthContext } from '../contexts/HealthContextProvider'
import Outline from '../displays/Outline'
import KanjiSkillTemplate from './KanjiSkillTemplate'
import KanjiBoxCorrect from '../displays/KanjiBoxCorrect'
import ChoicesButtons from '../components/ChoicesButton'

type Props = { glyphWidth: number }

/** Drag components to build a glyph */
const Recognize: FC<Props> = ({ glyphWidth }) => {
    const getGlyph = useContext(GetGlyphContext)
    const glyphInfo = getGlyph?.()

    return (
        <>
            <KanjiSkillTemplate
                KanjiComp={<Outline text="?" />}
                KanjiSuccComp={<KanjiBoxCorrect text={glyphInfo?.glyph} />}
                TextComp={
                    <KanjiMeaning text={glyphInfo?.meanings.primary ?? ''} />
                }
                ChoicesComp={
                    <ChoicesButtons
                        glyphInfo={glyphInfo}
                        glyphWidth={glyphWidth}
                    />
                }
            />
        </>
    )
}

export default Recognize
