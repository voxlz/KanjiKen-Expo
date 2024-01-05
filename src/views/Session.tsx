import React, { FC, useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import Compose from './Compose'
import Intro from './Intro'
import LowHealth from './LowHealth'
import Recognize from './Recognize'
import BottomBar from '../components/BottomBar'
import { ButtonStyles } from '../components/Button'
import LoadingScreen from '../components/LoadingScreen'
import UpperBar from '../components/UpperBar'
import {
   SetChallengeContext,
   SeenCountContext,
   ExpectedChoiceContext,
} from '../contexts/ChallengeContextProvider'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import {
   RelativeHealthContext,
   NewExerciseHealthContext,
   HealthContext,
   OnSessionEndContext,
} from '../contexts/HealthContextProvider'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { ResetFinishAnimationContext as ResetSkillAnimContext } from '../contexts/TaskAnimContextProvider'
import { glyphDict } from '../data/glyphDict'
import { clearDrops } from '../globalState/DropInfo'
import { Exercise } from '../types/progress'
import { useContext } from '../utils/react'

/** The general challenge view for doing kanji exercises */
const Session: FC = () => {
   // How wide is a glyph part of a 1x4 row with margins and gap considered?
   // Calc the scale, use this to scale UI

   // Context
   const scheduler = useContext(SchedulerContext)
   const setChallenge = useContext(SetChallengeContext)
   const seenCount = useContext(SeenCountContext)
   const expectedChoice = useContext(ExpectedChoiceContext)
   const resetSkillAnim = useContext(ResetSkillAnimContext)
   const glyphWidth = useContext(GlyphWidthContext)
   const newExerciseHealth = useContext(NewExerciseHealthContext)
   const health = useContext(HealthContext)
   const relativeHealth = useContext(RelativeHealthContext)
   const onSessionEnd = useContext(OnSessionEndContext)

   // State
   const [skillTitle, setSkillTitle] = useState('No title')
   const [continueBtnText, setContinueBtnText] = useState('Continue')
   const [exercise, setExercise] = useState<Exercise>()
   const [continueBtnStyle, setContinueBtnStyle] =
      useState<ButtonStyles>('forest')

   const nextExercise = useCallback(() => {
      // Ensure we reset so that we can take damage during this exercise
      newExerciseHealth()

      // Clear out previous dropareas.
      clearDrops()

      // If we are currently on an exercise, mark as reviewd and go to next.
      if (exercise) {
         resetSkillAnim()
         scheduler.onReview(1, exercise.level, glyphDict[exercise.glyph])
      }

      // Check so that we have not died.
      if (exercise && health <= 0) {
         onSessionEnd()
      } else {
         // Load the new or current challenge
         const next = scheduler.getCurrent()
         if (next) {
            setExercise(next)
            setChallenge?.(next)

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
         }
      }

      return undefined
   }, [
      exercise,
      health,
      newExerciseHealth,
      onSessionEnd,
      resetSkillAnim,
      scheduler,
      setChallenge,
   ])

   // When session starts
   useEffect(() => {
      if (!exercise) {
         console.log('session start', relativeHealth.value, exercise)
         nextExercise()
         resetSkillAnim(true) // In case they exited during an exercise.
      }
   }, [exercise, nextExercise, relativeHealth.value, resetSkillAnim])

   if (!exercise) return <LoadingScreen />

   return (
      <Animated.View className="items-center w-full h-full flex-grow">
         <UpperBar skillTitle={skillTitle} glyphWidth={glyphWidth} />
         <LowHealth>
            <View className="flex-grow flex-shrink items-center">
               {exercise.skill === 'compose' ? (
                  <Compose
                     key={seenCount}
                     showPositionHints={exercise.level === 0}
                  />
               ) : exercise.skill === 'recognize' ? (
                  <Recognize key={seenCount} />
               ) : (
                  <Intro
                     key={seenCount}
                     glyphWidth={glyphWidth}
                     onContinue={nextExercise}
                  />
               )}
            </View>
         </LowHealth>
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
