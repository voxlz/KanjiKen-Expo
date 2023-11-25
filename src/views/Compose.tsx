import React, { FC } from 'react'
import { View } from 'react-native'
import Alternative from '../components/Alternative'
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

type Props = { glyphWidth: number; showPositionHints: boolean }

/** Drag components to build a glyph */
const Compose: FC<Props> = ({ glyphWidth, showPositionHints }) => {
    const seenCount = useContext(SeenCountContext)
    const expectedChoice = useContext(ExpectedChoiceContext)
    const choices = useContext(ChoicesContext)
    const scheduler = useContext(SchedulerContext)
    const glyphInfo = glyphDict[scheduler.getCurrent().glyph]

    return (
        <>
            <KanjiSkillTemplate
                KanjiComp={
                    <KanjiComps
                        pos={glyphInfo?.comps.position}
                        key={seenCount}
                        showPositionHints={showPositionHints}
                    />
                }
                KanjiSuccComp={<KanjiBoxCorrect text={glyphInfo?.glyph} />}
                TextComp={
                    <KanjiMeaning text={glyphInfo?.meanings.primary ?? ''} />
                }
                ChoicesComp={
                    <View
                        style={{ gap: 12 }}
                        className="flex-row max-w-full flex-shrink flex-wrap h-auto px-8"
                    >
                        {choices?.map((alt, i) => {
                            const isCorrectAnswer =
                                glyphInfo?.comps.order.includes(alt.glyph!)
                            return (
                                <Alternative
                                    key={i + alt.glyph! + seenCount}
                                    altInfo={alt}
                                    width={glyphWidth}
                                    isCorrectAnswer={isCorrectAnswer ?? false}
                                    expectedChoice={expectedChoice}
                                />
                            )
                        })}
                    </View>
                }
            />
        </>
    )
}

export default Compose
