import React, { FC, useState, ReactNode, useCallback } from 'react'
import { shuffle } from '../functions/shuffle'
import { createContext as CC, useContext } from '../utils/react'
import { StartFinishAnimationContext } from './TaskAnimContextProvider'
import { Exercise, Learnable } from '../types/progress'
import { GlyphDictType } from '../types/glyphDict'
import { SchedulerContext } from './SchedulerContextProvider'
import { glyphDict } from '../data/glyphDict'
import ScheduleHandler from '../scheduler/scheduleHandler'
import { structuredClone } from '../utils/js'
import { clearDrops } from './DragContextProvider'

// Types
export type GlyphInfo = GlyphDictType[Learnable]
type SetChallengeType = ((exercise: Exercise) => void) | undefined

// Contexts
export const SetChallengeContext = CC<SetChallengeType>() // Provide info about any glyph. Defaults to current challenge glyph
export const SeenCountContext = CC<number>() // Keep track of challenges seen
export const ChoicesContext = CC<GlyphInfo[]>() // Keep track of question choice alternatives
export const OnCorrectChoiceContext = CC<() => void>() // Keep track of question choice alternatives
export const ExpectedChoiceContext = CC<string>() // Keep track of next correct choice, and if we are finished.

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
            let info = glyphDict[excercise.glyph]

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

            let findRandom = 8 - choices.length
            do {
                const seenGlyph = getRandomSeenGlyphInfo(scheduler)

                // const duplicate = choices
                //     .map((info) => info.glyph)
                //     .includes(seenGlyph.glyph)
                // const seenCount = Object.keys(scheduler.getProgress()).length
                // console.log('seen', seenGlyph.glyph, duplicate, seenCount)
                if (excercise.glyph !== seenGlyph.glyph) {
                    choices = choices.concat(seenGlyph)
                    findRandom -= 1
                }
            } while (findRandom > 0)

            const newExpectedChoice = onOrderIdxChange(
                answers,
                exeState.expectedAnswer,
                0
            )

            clearDrops()
            
            // Update state
            // setChoices(shuffle(choices))
            // setAnswerOrder(answers)
            // setOrderIdx(0)
            // setSeenCount((id) => id + 1)
            const newExeState = structuredClone(exeState)
            newExeState.choices = shuffle(choices)
            newExeState.answerOrderIdx = 0
            newExeState.answerOrder = answers
            newExeState.seenCount += 1
            newExeState.expectedAnswer = newExpectedChoice
            setExeState(newExeState)
        },
        [exeState, glyphDict]
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
    }, [exeState, onOrderIdxChange, structuredClone, setExeState])

    return (
        <SetChallengeContext.Provider value={setChallenge}>
            <OnCorrectChoiceContext.Provider value={onCorrectChoice}>
                <ExpectedChoiceContext.Provider value={exeState.expectedAnswer}>
                    <SeenCountContext.Provider value={exeState.seenCount}>
                        <ChoicesContext.Provider value={exeState.choices}>
                            {children}
                        </ChoicesContext.Provider>
                    </SeenCountContext.Provider>
                </ExpectedChoiceContext.Provider>
            </OnCorrectChoiceContext.Provider>
        </SetChallengeContext.Provider>
    )
}

const getRandomGlyphInfo = () => {
    const possibleGlyphs = Object.keys(glyphDict) as Learnable[]
    const randIdx = () => Math.floor(Math.random() * possibleGlyphs.length)
    const glyph = possibleGlyphs.at(randIdx())!
    return glyphDict[glyph]
}

const getRandomSeenGlyphInfo = (scheduler: ScheduleHandler) => {
    const possibleGlyphs = Object.keys(scheduler.getProgress()) as Learnable[]
    if (possibleGlyphs.length < 8) {
        return getRandomGlyphInfo()
    }
    const randIdx = () => Math.floor(Math.random() * possibleGlyphs.length)
    const glyph = possibleGlyphs.at(randIdx())!
    return glyphDict[glyph]
}

export default ChallengeContextProvider
