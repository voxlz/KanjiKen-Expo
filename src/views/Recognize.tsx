import React, { FC } from 'react'
import KanjiBoxCorrect from '../displays/KanjiBoxCorrect'
import KanjiMeaning from '../displays/KanjiMeaning'
import { useContext } from '../utils/react'
import KanjiSkillTemplate from './KanjiSkillTemplate'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { glyphDict } from '../data/glyphDict'
import KanjiComps from '../components/KanjiComps'
import DraggableChoicesButtons from '../components/DraggableChoicesButtons'

type Props = {}

/** Drag components to build a glyph */
const Recognize: FC<Props> = ({}) => {
    const scheduler = useContext(SchedulerContext)
    const solution = glyphDict[scheduler.getCurrent().glyph]
    return (
        <>
            <KanjiSkillTemplate
                KanjiComp={
                    <KanjiComps
                        pos={{ col: [solution?.glyph] }}
                        showPositionHints={false}
                    />
                }
                KanjiSuccComp={<KanjiBoxCorrect text={solution?.glyph} />}
                TextComp={
                    <KanjiMeaning text={solution?.meanings.primary ?? ''} />
                }
                ChoicesComp={
                    <DraggableChoicesButtons
                        hintOnDrag={false}
                        clickable={true}
                        isCorrectAnswer={(glyph) => solution?.glyph === glyph}
                    />
                }
            />
        </>
    )
}

export default Recognize
