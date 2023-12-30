import React, { FC } from 'react'

import KanjiSkillTemplate from './KanjiSkillTemplate'
import DraggableChoicesButtons from '../components/DraggableChoicesButtons'
import KanjiComps from '../components/KanjiComps'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { glyphDict } from '../data/glyphDict'
import KanjiBoxCorrect from '../displays/KanjiBoxCorrect'
import KanjiMeaning from '../displays/KanjiMeaning'
import { useContext } from '../utils/react'

/** Drag components to build a glyph */
const Recognize: FC = () => {
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
            TextComp={<KanjiMeaning text={solution?.meanings.primary ?? ''} />}
            ChoicesComp={
               <DraggableChoicesButtons
                  hintOnDrag={false}
                  isCorrectAnswer={(glyph) => solution?.glyph === glyph}
               />
            }
         />
      </>
   )
}

export default Recognize
