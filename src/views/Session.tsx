import React, { FC, useEffect, useState, useRef } from 'react'
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

    // Context
    const setChallenge = useContext(SetChallengeContext)
    const seenCount = useContext(SeenCountContext)
    const getGlyph = useContext(GetGlyphContext)
    const expectedChoice = useContext(ExpectedChoiceContext)
    // const progress = useContext(ProgressContext)
    // const progressDispatch = useContext(ProgressDispatchContext)
    const resetSkillAnim = useContext(ResetSkillAnimContext)

    // REF
    const scheduler = useRef(
        new ScheduleHandler(learnOrder.map((glyph) => getGlyph(glyph)))
    ).current

    // State
    const [skillTitle, setSkillTitle] = useState('No title')
    const [continueBtnText, setContinueBtnText] = useState('Continue')
    const [exercise, setExercise] = useState<Exercise>(scheduler.getNext())
    const [continueBtnStyle, setContinueBtnStyle] =
        useState<ButtonStyles>('forest')

    // Set next challenge
    useEffect(() => {
        setExercise(exercise)
        setChallenge?.(exercise)

        switch (exercise.skill) {
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
    }, [])

    const onNextExercise = () => {
        scheduler.onReview(1, exercise.level)
        setExercise(scheduler.getNext())
        setChallenge?.(scheduler.getNext())
        resetSkillAnim()

        // setProgressIdx(newIdx)
        return undefined
    }

    return (
        <Animated.View className="items-center pt-20 w-full h-full flex-grow ">
            <HealthBar glyphWidth={glyphWidth} />
            <StatusBar seenCount={seenCount} text={skillTitle} />
            <View className="flex-grow flex-shrink items-center">
                {exercise?.skill === 'compose' ? (
                    <Compose key={seenCount} glyphWidth={glyphWidth} />
                ) : exercise?.skill === 'recognize' ? (
                    <Recognize key={seenCount} glyphWidth={glyphWidth} />
                ) : (
                    <Intro
                        key={seenCount}
                        glyphWidth={glyphWidth}
                        onContinue={onNextExercise}
                    />
                )}
            </View>
            <BottomBar
                onContinue={() => {
                    if (expectedChoice === 'FINISH') return onNextExercise()
                }}
                glyphWidth={glyphWidth}
                continueBtnText={continueBtnText}
                continueBtnStyle={continueBtnStyle}
            />
        </Animated.View>
    )
}

export default Session
