import React, { FC, useState, ReactNode, useCallback } from 'react'

import { SchedulerContext } from './SchedulerContextProvider'
import { StartFinishAnimationContext } from './TaskAnimContextProvider'
import { glyphDict } from '../data/glyphDict'
import { shuffle } from '../functions/shuffle'
import { clearDrops } from '../globalState/DropInfo'
import ScheduleHandler from '../scheduler/scheduleHandler'
import { GlyphDictType } from '../types/glyphDict'
import { Exercise, Learnable } from '../types/progress'
import { structuredClone } from '../utils/js'
import { createContext as CC, useContext } from '../utils/react'

// Types
export type GlyphInfo = GlyphDictType[Learnable]
type SetChallengeType = ((exercise: Exercise) => void) | undefined

// Contexts
export const SetChallengeContext = CC<SetChallengeType>() // Provide info about any glyph. Defaults to current challenge glyph
export const SeenCountContext = CC<number>() // Keep track of challenges seen
export const ChoicesContext = CC<GlyphInfo[]>() // Keep track of question choice alternatives
export const OnCorrectChoiceContext = CC<() => void>() // Keep track of question choice alternatives
export const ExpectedChoiceContext = CC<string>() // Keep track of next correct choice, and if we are finished.
export const TriesContext = CC<number>() // Keep track of next correct choice, and if we are finished.
export const SetTriesContext =
   CC<(updateFunc: (old: number) => number) => void>() // Keep track of next correct choice, and if we are finished.

const ChallengeContextProvider: FC<{ children?: ReactNode }> = ({
   children,
}) => {
   // Context state
   const startAnimation = useContext(StartFinishAnimationContext)
   const scheduler = useContext(SchedulerContext)

   // Local state
   const [exeState, setExeState] = useState({
      answerOrder: undefined as string[] | undefined,
      answerOrderIdx: 0,
      expectedAnswer: '',
      seenCount: 0,
      choices: [] as GlyphInfo[],
   })

   const [tries, setTries] = useState(1)

   const onOrderIdxChange = useCallback(
      (
         answerOrder: string[] | undefined,
         prevExpectedAnswer: string,
         answerOrderIdx: number
      ) => {
         const tempExpectChoice = answerOrder
            ? answerOrder[answerOrderIdx] ?? 'FINISH'
            : ''

         if (tempExpectChoice === 'FINISH') {
            startAnimation()
         }

         /** Get the next correct choice. Returns "FINISH" if finished */
         return prevExpectedAnswer !== tempExpectChoice
            ? tempExpectChoice
            : prevExpectedAnswer
      },
      [startAnimation]
   )

   const setChallenge = useCallback(
      (excercise: Exercise) => {
         const info = glyphDict[excercise.glyph]

         // Set the answers
         let answers: string[]
         switch (excercise.skill) {
            case 'intro':
               answers = ['just press the button']
               break
            case 'compose':
               answers = info.comps.order
               break
            case 'recognize':
               answers = [info.glyph]
               break
            default:
               answers = []
               break
         }

         // Set choices
         let choices: GlyphInfo[]
         switch (excercise.skill) {
            case 'intro':
               choices = []
               break
            case 'compose':
               choices = info.comps.order.map((glyph) => glyphDict[glyph])
               break
            case 'recognize':
               choices = [info]
               break
            default:
               choices = []
               break
         }

         // Prepare choices
         if (excercise.skill !== 'intro') {
            let findRandom = 8 - choices.length
            do {
               const seenGlyph = getRandomSeenGlyphInfo(scheduler)
               if (excercise.skill === 'compose') {
                  if (excercise.glyph !== seenGlyph.glyph) {
                     choices = choices.concat(seenGlyph)
                     findRandom -= 1
                  }
               } else {
                  choices = choices.concat(seenGlyph)
                  findRandom -= 1
               }
            } while (findRandom > 0)
         }

         const newExpectedChoice = onOrderIdxChange(
            answers,
            exeState.expectedAnswer,
            0
         )

         clearDrops()

         // Update state
         const newExeState = structuredClone(exeState)
         newExeState.choices = shuffle(choices)
         newExeState.answerOrderIdx = 0
         newExeState.answerOrder = answers
         newExeState.seenCount += 1
         newExeState.expectedAnswer = newExpectedChoice
         setExeState(newExeState)
      },
      [exeState, onOrderIdxChange, scheduler]
   )

   /** What happens when user answers correctly */
   const onCorrectChoice = useCallback(() => {
      const newExeState = structuredClone(exeState)
      newExeState.answerOrderIdx = exeState.answerOrderIdx + 1
      newExeState.expectedAnswer = onOrderIdxChange(
         exeState.answerOrder,
         exeState.expectedAnswer,
         exeState.answerOrderIdx + 1
      )
      setExeState(newExeState)
   }, [exeState, onOrderIdxChange, setExeState])

   return (
      <SetChallengeContext.Provider value={setChallenge}>
         <OnCorrectChoiceContext.Provider value={onCorrectChoice}>
            <ExpectedChoiceContext.Provider value={exeState.expectedAnswer}>
               <SeenCountContext.Provider value={exeState.seenCount}>
                  <ChoicesContext.Provider value={exeState.choices}>
                     <TriesContext.Provider value={tries}>
                        <SetTriesContext.Provider value={setTries}>
                           {children}
                        </SetTriesContext.Provider>
                     </TriesContext.Provider>
                  </ChoicesContext.Provider>
               </SeenCountContext.Provider>
            </ExpectedChoiceContext.Provider>
         </OnCorrectChoiceContext.Provider>
      </SetChallengeContext.Provider>
   )
}

const getRandomSeenGlyphInfo = (scheduler: ScheduleHandler) => {
   const possibleGlyphs = Object.keys(scheduler.getProgress()) as Learnable[]
   const randIdx = () => Math.floor(Math.random() * possibleGlyphs.length)
   const glyph = possibleGlyphs.at(randIdx())!
   return glyphDict[glyph]
}

export default ChallengeContextProvider
