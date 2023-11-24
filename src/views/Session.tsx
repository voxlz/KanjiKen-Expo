import React, { FC, useEffect, useState } from 'react'
import { View, useWindowDimensions, Text } from 'react-native'
import BottomBar from '../components/BottomBar'
import {
    SetChallengeContext,
    SeenCountContext,
} from '../contexts/ChallengeContextProvider'
import Animated from 'react-native-reanimated'
import Compose from './Compose'
import { learnOrder } from '../data/learnOrder'
import {
    GetGlyphContext,
    ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import { useContext } from '../utils/react'
import Recognize from './Recognize'
import { ButtonStyles } from '../components/Button'
import { Exercise } from '../types/progress'
import Intro from './Intro'
import { ResetFinishAnimationContext as ResetSkillAnimContext } from '../contexts/TaskAnimContextProvider'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import UpperBar from '../components/UpperBar'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'

/** The general challenge view for building a kanji through components */
const Session: FC<{}> = ({}) => {
    // How wide is a glyph part of a 1x4 row with margins and gap considered?
    // Calc the scale, use this to scale UI

    const [isLoading, setIsLoading] = useState(true)

    // Context
    const scheduler = useContext(SchedulerContext)
    const setChallenge = useContext(SetChallengeContext)
    const seenCount = useContext(SeenCountContext)
    const getGlyph = useContext(GetGlyphContext)
    const expectedChoice = useContext(ExpectedChoiceContext)
    const resetSkillAnim = useContext(ResetSkillAnimContext)
    const glyphWidth = useContext(GlyphWidthContext)

    useEffect(() => {
        scheduler
            .loadFromDisk()
            .then(() => {
                console.log('load from disk successful')
            })
            .catch(() => {
                const learnInfoArr = learnOrder.map((glyph) => getGlyph(glyph))
                scheduler.init(learnInfoArr)
            })
            .finally(() => {
                nextExercise()
                setIsLoading(false)
            })
    }, [])

    // State
    const [skillTitle, setSkillTitle] = useState('No title')
    const [continueBtnText, setContinueBtnText] = useState('Continue')
    const [exercise, setExercise] = useState<Exercise>()
    const [continueBtnStyle, setContinueBtnStyle] =
        useState<ButtonStyles>('forest')

    const nextExercise = () => {
        // If we are currently on an exercise, mark as reviewd.
        if (exercise) {
            resetSkillAnim()
            scheduler.onReview(1, exercise.level, getGlyph(exercise.glyph))
        }
        const next = scheduler.getNext()
        setExercise(next)
        setChallenge?.(scheduler.getNext())

        switch (next.skill) {
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
            case 'intro':
                setSkillTitle('New')
                setContinueBtnText('Memorized')
                setContinueBtnStyle('forest')
                break
            default:
                setSkillTitle('ERR')
                setContinueBtnText('ERR')
                setContinueBtnStyle('forest')
                break
        }

        // setProgressIdx(newIdx)
        return undefined
    }

    if (isLoading || !exercise)
        return (
            <View className="flex-grow justify-center items-center">
                <Text>Loading</Text>
            </View>
        )

    return (
        <Animated.View className="items-center w-full h-full flex-grow ">
            <UpperBar skillTitle={skillTitle} glyphWidth={glyphWidth} />
            <View className="flex-grow flex-shrink items-center">
                {exercise?.skill === 'compose' ? (
                    <Compose
                        key={seenCount}
                        glyphWidth={glyphWidth}
                        showPositionHints={exercise.level === 0}
                    />
                ) : exercise?.skill === 'recognize' ? (
                    <Recognize key={seenCount} glyphWidth={glyphWidth} />
                ) : (
                    <Intro
                        key={seenCount}
                        glyphWidth={glyphWidth}
                        onContinue={nextExercise}
                    />
                )}
            </View>
            <BottomBar
                onContinue={() => {
                    if (expectedChoice === 'FINISH') return nextExercise()
                }}
                glyphWidth={glyphWidth}
                continueBtnText={continueBtnText}
                continueBtnStyle={continueBtnStyle}
            />
        </Animated.View>
    )
}

export default Session
