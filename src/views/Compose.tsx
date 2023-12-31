import React, { FC } from 'react'

import KanjiSkillTemplate from './KanjiSkillTemplate'
import DraggableChoicesButtons from '../components/DraggableChoicesButtons'
import KanjiComps from '../components/KanjiComps'
import { SeenCountContext } from '../contexts/ChallengeContextProvider'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { glyphDict } from '../data/glyphDict'
import KanjiBoxCorrect from '../displays/KanjiBoxCorrect'
import KanjiMeaning from '../displays/KanjiMeaning'
import { useContext } from '../utils/react'

type Props = { showPositionHints: boolean }

/** Drag components to build a glyph */
const Compose: FC<Props> = ({ showPositionHints }) => {
   const seenCount = useContext(SeenCountContext)
   const scheduler = useContext(SchedulerContext)
   const solution = glyphDict[scheduler.getCurrent()!.glyph]

   return (
      <>
         <KanjiSkillTemplate
            KanjiComp={
               <KanjiComps
                  pos={solution?.comps.position ?? undefined}
                  key={seenCount}
                  showPositionHints={showPositionHints}
               />
            }
            KanjiSuccComp={<KanjiBoxCorrect text={solution?.glyph} />}
            TextComp={<KanjiMeaning text={solution?.meanings.primary ?? ''} />}
            ChoicesComp={<DraggableChoicesButtons hintOnDrag />}
         />
      </>
   )
}

export default Compose
