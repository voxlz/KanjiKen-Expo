import React, { FC, useEffect, useState, useRef } from 'react'
import { View, useWindowDimensions, Text } from 'react-native'
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
import {
    GetGlyphContext,
    ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import { useContext } from '../utils/react'
import Recognize from './Recognize'
import { ButtonStyles } from '../components/Button'
// import {
//     ProgressContext,
//     ProgressDispatchContext,
// } from '../contexts/ProgressContextProvider'
import { Exercise, LvL, Skills } from '../types/progress'
import Intro from './Intro'
import { ResetFinishAnimationContext as ResetSkillAnimContext } from '../contexts/TaskAnimContextProvider'
import { ScheduleHandler } from '../ScheduleHandler'

/** The general challenge view for building a kanji through components */
const Session: FC<{}> = ({}) => {
    // How wide is a glyph part of a 1x4 row with margins and gap considered?
    // Calc the scale, use this to scale UI
    const { width: windowWidth } = useWindowDimensions()
    const margin = 36 * 2
    const gap = 3 * 12
    const glyphWidth = (windowWidth - margin - gap) / 4
    const [isLoading, setIsLoading] = useState(true)

    // Context
    const setChallenge = useContext(SetChallengeContext)
    const seenCount = useContext(SeenCountContext)
    const getGlyph = useContext(GetGlyphContext)
    const expectedChoice = useContext(ExpectedChoiceContext)
    // const progress = useContext(ProgressContext)
    // const progressDispatch = useContext(ProgressDispatchContext)
    const resetSkillAnim = useContext(ResetSkillAnimContext)

    // REF
    const scheduler = useRef(new ScheduleHandler()).current

    useEffect(() => {
        scheduler.loadFromDisk
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
        <Animated.View className="items-center pt-20 w-full h-full flex-grow ">
            <HealthBar glyphWidth={glyphWidth} />
            <StatusBar seenCount={seenCount} text={skillTitle} />
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
