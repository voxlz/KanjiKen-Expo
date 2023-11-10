import React, { FC, useState, ReactNode } from 'react'
import { glyphDictLoader, GlyphDictType } from '../data/glyphDict'
import { DropsDispatchContext } from './DragContextProvider'
import { shuffle } from '../functions/shuffle'
import { createContext as CC, useContext } from '../utils/react'
import {
    StartFinishAnimationContext,
    ResetFinishAnimationContext,
} from './TaskAnimContextProvider'

// Types
export type GlyphInfo = GlyphDictType[0]
type GetGlyphType = ((glyph?: string) => GlyphInfo | undefined) | undefined
type SetChallengeType = ((glyph?: string) => void) | undefined

// Contexts
export const SetChallengeContext = CC<SetChallengeType>() // Provide info about any glyph. Defaults to current challenge glyph
export const GetGlyphContext = CC<GetGlyphType>() // Provide info about any glyph. Defaults to current challenge glyph
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
    const resetAnimation = useContext(ResetFinishAnimationContext)

    // Local state
    const [dict] = useState(glyphDictLoader())
    const [correctOrder, setCorrectOrder] = useState<string[]>()
    const [orderIdx, setOrderIdx] = useState(0)

    // Exposed state
    const [challengeInfo, setGlyphInfo] = useState<GlyphInfo>()
    const [seenCount, setSeenCount] = useState(0) // Used to keep apart different challanges. Used in key's for example.
    const [choices, setChoices] = useState<GlyphInfo[]>([])

    /** Provide an API to get glyphInfo */
    const getGlyphInfo = (glyph?: string) => {
        if (!glyph) return challengeInfo

        // Return info
        const info = dict[glyph]
        info.glyph = glyph
        return info
    }

    const getRandomGlyphInfo = () => {
        const randIdx = () => Math.floor(Math.random() * possibleGlyphs.length)
        const possibleGlyphs = Object.keys(dict)
        const glyph = possibleGlyphs.at(randIdx())!
        return getGlyphInfo(glyph)
    }

    const setChallenge = (glyph?: string) => {
        let info: GlyphInfo | undefined

        // If undefined, select random
        if (!glyph) {
            do {
                info = getRandomGlyphInfo()
            } while (!info?.comps.position)
        } else {
            info = getGlyphInfo(glyph)
        }

        // Something strange happened
        if (!info) {
            console.warn(
                'No glyph set. Probably glyph was set to something wierd.'
            )
            return
        }

        // Set alts
        let altInfos = info.comps.order.map((alt) => getGlyphInfo(alt))
        let findRandom = 8 - altInfos.length
        do {
            altInfos = altInfos.concat(getRandomGlyphInfo())
            findRandom -= 1
        } while (findRandom > 0)
        setChoices(shuffle(altInfos))

        // reset animation
        if (challengeInfo) resetAnimation()

        // Update state
        setGlyphInfo(info)
        setCorrectOrder(info.comps.order)
        setOrderIdx(info.comps.position ? 0 : -1)
        dropsDispatch?.({ type: 'clear' })
        setSeenCount((id) => id + 1)
    }

    /** Get the next correct choice. Returns "FINISH" if finished */
    const getExpectedChoice = correctOrder
        ? correctOrder[orderIdx] ?? 'FINISH'
        : ''

    if (getExpectedChoice === 'FINISH') {
        startAnimation()
    }
    /** What happens when user answers correctly */
    const onCorrectChoice = () => {
        setOrderIdx(orderIdx + 1)
    }

    return (
        <SetChallengeContext.Provider value={setChallenge}>
            <GetGlyphContext.Provider value={getGlyphInfo}>
                <OnCorrectChoiceContext.Provider value={onCorrectChoice}>
                    <ExpectedChoiceContext.Provider value={getExpectedChoice}>
                        <SeenCountContext.Provider value={seenCount}>
                            <ChoicesContext.Provider value={choices}>
                                {children}
                            </ChoicesContext.Provider>
                        </SeenCountContext.Provider>
                    </ExpectedChoiceContext.Provider>
                </OnCorrectChoiceContext.Provider>
            </GetGlyphContext.Provider>
        </SetChallengeContext.Provider>
    )
}

export default ChallengeContextProvider
