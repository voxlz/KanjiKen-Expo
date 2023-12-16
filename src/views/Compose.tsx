import React, { FC } from 'react'
import { View } from 'react-native'
import Choice from '../components/Choice'
import KanjiComps from '../components/KanjiComps'
import KanjiMeaning from '../displays/KanjiMeaning'
import {
    ChoicesContext,
    ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import { SeenCountContext } from '../contexts/ChallengeContextProvider'
import { useContext } from '../utils/react'
import KanjiSkillTemplate from './KanjiSkillTemplate'
import KanjiBoxCorrect from '../displays/KanjiBoxCorrect'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { glyphDict } from '../data/glyphDict'
import { defaultGap } from '../utils/consts'
import DraggableChoicesButtons from '../components/DraggableChoicesButtons'

type Props = { glyphWidth: number; showPositionHints: boolean }

/** Drag components to build a glyph */
const Compose: FC<Props> = ({ glyphWidth, showPositionHints }) => {
    const seenCount = useContext(SeenCountContext)
    const scheduler = useContext(SchedulerContext)
    const solution = glyphDict[scheduler.getCurrent().glyph]

    return (
        <>
            <KanjiSkillTemplate
                KanjiComp={
                    <KanjiComps
                        pos={solution?.comps.position}
                        key={seenCount}
                        showPositionHints={showPositionHints}
                    />
                }
                KanjiSuccComp={<KanjiBoxCorrect text={solution?.glyph} />}
                TextComp={
                    <KanjiMeaning text={solution?.meanings.primary ?? ''} />
                }
                ChoicesComp={
                    <DraggableChoicesButtons
                        isCorrectAnswer={(glyph) =>
                            solution?.comps.order.includes(glyph)
                        }
                        clickable={false}
                        hintOnDrag={true}
                    />
                }
            />
        </>
    )
}

export default Compose
