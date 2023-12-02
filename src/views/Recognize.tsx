import React, { FC } from 'react'
import ChoicesButtons from '../components/ChoicesButton'
import KanjiBoxCorrect from '../displays/KanjiBoxCorrect'
import KanjiMeaning from '../displays/KanjiMeaning'
import Outline from '../displays/Outline'
import { useContext } from '../utils/react'
import KanjiSkillTemplate from './KanjiSkillTemplate'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { glyphDict } from '../data/glyphDict'

type Props = { glyphWidth: number }

/** Drag components to build a glyph */
const Recognize: FC<Props> = ({ glyphWidth }) => {
    const scheduler = useContext(SchedulerContext)
    const glyphInfo = glyphDict[scheduler.getCurrent().glyph]
    return (
        <>
            <KanjiSkillTemplate
                KanjiComp={<Outline text="?" dashed={false} />}
                KanjiSuccComp={<KanjiBoxCorrect text={glyphInfo?.glyph} />}
                TextComp={
                    <KanjiMeaning text={glyphInfo?.meanings.primary ?? ''} />
                }
                ChoicesComp={<ChoicesButtons glyphInfo={glyphInfo} />}
            />
        </>
    )
}

export default Recognize
