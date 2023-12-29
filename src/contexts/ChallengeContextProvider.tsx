import React, { FC, useState, ReactNode, useEffect, useCallback } from 'react'
import { DropsDispatchContext } from './DragContextProvider'
import { shuffle } from '../functions/shuffle'
import { createContext as CC, useContext } from '../utils/react'
import { StartFinishAnimationContext } from './TaskAnimContextProvider'
import { Exercise, Learnable } from '../types/progress'
import { GlyphDictType } from '../types/glyphDict'
import { SchedulerContext } from './SchedulerContextProvider'
import { glyphDict } from '../data/glyphDict'
import ScheduleHandler from '../scheduler/scheduleHandler'

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
    const dropsDispatch = useContext(DropsDispatchContext)
    const startAnimation = useContext(StartFinishAnimationContext)
    const scheduler = useContext(SchedulerContext)

    // Local state
    const [correctOrder, setAnswerOrder] = useState<string[]>()
    const [orderIdx, setOrderIdx] = useState(0)
    const [expectedChoice, setExpectedChoice] = useState('')

    // Exposed state
    const [seenCount, setSeenCount] = useState(0) // Used to keep apart different challanges. Used in key's for example.
    const [choices, setChoices] = useState<GlyphInfo[]>([])

    const setChallenge = useCallback((excercise: Exercise) => {
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

        // Set alts
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

        // console.log('choices', choices)

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

        setChoices(shuffle(choices))

        // Update state
        setAnswerOrder(answers)
        setOrderIdx(0)
        dropsDispatch?.({ type: 'clear' })
        setSeenCount((id) => id + 1)
    }, [])

    useEffect(() => {
        const tempExpectChoice = correctOrder
            ? correctOrder[orderIdx] ?? 'FINISH'
            : ''
        /** Get the next correct choice. Returns "FINISH" if finished */
        if (expectedChoice !== tempExpectChoice)
            setExpectedChoice(tempExpectChoice)

        if (tempExpectChoice === 'FINISH') {
            startAnimation()
        }
    }, [correctOrder, orderIdx])

    /** What happens when user answers correctly */
    const onCorrectChoice = useCallback(
        () => setOrderIdx((order) => order + 1),
        []
    )

    return (
        <SetChallengeContext.Provider value={setChallenge}>
            <OnCorrectChoiceContext.Provider value={onCorrectChoice}>
                <ExpectedChoiceContext.Provider value={expectedChoice}>
                    <SeenCountContext.Provider value={seenCount}>
                        <ChoicesContext.Provider value={choices}>
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
