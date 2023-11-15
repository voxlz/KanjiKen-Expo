import React, { FC, useEffect, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import HealthBar from '../components/HealthBar'
import StatusBar from '../components/StatusBar'
import BottomBar from '../components/BottomBar'
import {
    SetChallengeContext,
    SeenCountContext,
} from '../contexts/ChallengeContextProvider'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import Compose from './Compose'
import { learnOrder } from '../data/learnOrder'
import { GetGlyphContext } from '../contexts/ChallengeContextProvider'
import { useContext } from '../utils/react'
import Recognize from './Recognize'
import { ButtonStyles } from '../components/Button'
import {
    ProgressContext,
    ProgressDispatchContext,
} from '../contexts/ProgressContextProvider'
import { Lvl, Skills } from '../types/progress'
import NewGlyph from './NewGlyph'
import { ResetFinishAnimationContext as ResetSkillAnimContext } from '../contexts/TaskAnimContextProvider'

/** The general challenge view for building a kanji through components */
const Session: FC<{}> = ({}) => {
    // How wide is a glyph part of a 1x4 row with margins and gap considered?
    // Calc the scale, use this to scale UI
    const { width: windowWidth } = useWindowDimensions()
    const margin = 36 * 2
    const gap = 3 * 12
    const glyphWidth = (windowWidth - margin - gap) / 4

    // Context
    const setChallenge = useContext(SetChallengeContext)
    const seenCount = useContext(SeenCountContext)
    const getGlyph = useContext(GetGlyphContext)
    const progress = useContext(ProgressContext)
    const progressDispatch = useContext(ProgressDispatchContext)
    const resetSkillAnim = useContext(ResetSkillAnimContext)

    // State
    const [progressIdx, setProgressIdx] = useState(0)
    const [skillTitle, setSkillTitle] = useState('No title')
    const [continueBtnText, setContinueBtnText] = useState('Continue')
    const [exercise, setExercise] = useState<Skills | 'new'>('new')
    const [continueBtnStyle, setContinueBtnStyle] =
        useState<ButtonStyles>('forest')

    // Set next challenge
    useEffect(() => {
        const nextGlyph = learnOrder[progressIdx]
        const prog = progress[nextGlyph]

        // Ensure there is a progress entry.
        if (prog === undefined) {
            console.log(nextGlyph, prog, progress)

            progressDispatch({ type: 'add', glyphInfo: getGlyph(nextGlyph) })
        } else {
            let exercise: Skills | 'new'
            exercise = prog.skills.compose ? 'compose' : 'recognize'
            if (prog.skills[exercise]!.level == Lvl.UNSEEN) exercise = 'new'

            switch (exercise) {
                case 'compose':
                    setSkillTitle('Compose')
                    setContinueBtnText('Continue')
                    setContinueBtnStyle('forest')
                    break
                case 'recognize':
                    setSkillTitle('Recognize')
                    setContinueBtnText('Continue')
                    setContinueBtnStyle('forest')
                    break
                default:
                    setSkillTitle('New')
                    setContinueBtnText('Memorized')
                    setContinueBtnStyle('forest')
                    break
            }
            setExercise(exercise)
            setChallenge?.(nextGlyph)
        }
    }, [progress])

    return (
        <Animated.View className="items-center pt-20 w-full h-full flex-grow ">
            <HealthBar glyphWidth={glyphWidth} />
            <StatusBar seenCount={seenCount} text={skillTitle} />
            <View className="flex-grow flex-shrink items-center">
                {exercise === 'compose' ? (
                    <Compose glyphWidth={glyphWidth} />
                ) : exercise === 'recognize' ? (
                    <Recognize glyphWidth={glyphWidth} />
                ) : (
                    <NewGlyph
                        glyphWidth={glyphWidth}
                        onContinue={() => {
                            const newIdx = progressIdx + 1
                            setChallenge?.(learnOrder[newIdx])
                            setProgressIdx(newIdx)
                            return undefined
                        }}
                    />
                )}
            </View>
            <BottomBar
                onContinue={() => {
                    const newIdx = progressIdx + 1
                    setChallenge?.(learnOrder[newIdx])
                    setProgressIdx(newIdx)
                    resetSkillAnim()
                    return undefined
                }}
                glyphWidth={glyphWidth}
                continueBtnText={continueBtnText}
                continueBtnStyle={continueBtnStyle}
            />
        </Animated.View>
    )
}

export default Session
