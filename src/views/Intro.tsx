import React, { FC, useState } from 'react'
import { Text, View } from 'react-native'
import Animated, {
   Extrapolation,
   interpolate,
   useAnimatedStyle,
   useDerivedValue,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated'

import Button from '../components/Button'
import { OnCorrectChoiceContext } from '../contexts/ChallengeContextProvider'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { ContinueAnimInstantResetContext as SkillAnimInstantResetContext } from '../contexts/TaskAnimContextProvider'
import { glyphDict } from '../data/glyphDict'
import KanjiMeaning from '../displays/KanjiMeaning'
import { font } from '../utils/fonts'
import { useContext } from '../utils/react'

type Props = {
   glyphWidth: number
   onContinue: () => boolean | undefined
}

/**
 * The screen introducing a new glyph too the user.
 * Let's user instantly challenge themselves.
 */
const Intro: FC<Props> = ({ glyphWidth }) => {
   const onCorrectChoice = useContext(OnCorrectChoiceContext)
   const skillAnim = useContext(SkillAnimInstantResetContext)
   const scheduler = useContext(SchedulerContext)
   const glyph = scheduler.getCurrent()?.glyph
   if (!glyph) console.warn('no glyph present', glyph)
   const glyphInfo = glyphDict[glyph!]

   const [showMeaning, setShowMeaning] = useState(false)
   const fadeAnim = useSharedValue(0)

   // Styles for animation
   const textStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      transform: [{ translateY: interpolate(fadeAnim.value, [0, 1], [50, 0]) }],
   }))

   const builderStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
         skillAnim.value,
         [-1, 0, 1],
         [1, 1, 1],
         Extrapolation.EXTEND
      ),
      transform: [
         {
            scale: interpolate(
               skillAnim.value,
               [-1, 0, 1],
               [1, 1.2, 1],
               Extrapolation.EXTEND
            ),
         },
      ],
   }))

   // Btn fade out / Text fade in
   const fadeAnimInv = useDerivedValue(() => 1 - fadeAnim.value, [fadeAnim])
   const btnsAnimStyle = useAnimatedStyle(() => ({
      opacity: fadeAnimInv.value,
   }))

   return (
      <View className="w-full h-full items-center justify-between">
         <View className="items-center">
            <View className="w-2/4  h-auto aspect-square">
               <Animated.View
                  style={builderStyle}
                  className=" bg-ui-very_light border-ui-disabled border-4 flex-grow flex-shrink rounded-xl items-center justify-center leading-none  align-text-bottom	"
               >
                  <Text
                     style={{ fontFamily: font(glyph, 'klee-bold') }}
                     className="text-8xl p-2 -mb-6"
                     adjustsFontSizeToFit
                  >
                     {glyph}
                  </Text>
               </Animated.View>
            </View>
            <View className="items-center">
               <Animated.View style={textStyle}>
                  <KanjiMeaning text={glyphInfo?.meanings.primary ?? ''} />
               </Animated.View>
               <Animated.View
                  style={[
                     btnsAnimStyle,
                     {
                        pointerEvents: showMeaning ? 'none' : 'auto',
                     },
                  ]}
                  className="-mt-14"
               >
                  <KanjiMeaning text="New character!" />
               </Animated.View>
            </View>
         </View>
         <Animated.View
            id="btns"
            className="-mb-10"
            style={[
               btnsAnimStyle,
               {
                  pointerEvents: showMeaning ? 'none' : 'auto',
               },
            ]}
         >
            <View
               style={{ height: 0.85714285714 * glyphWidth }}
               className="flex-row max-w-full flex-shrink flex-wrap h-auto px-8 flex-grow-0 mb-4"
            >
               {/* <View className="w-full ">
                        <Button
                            text="I might know this..."
                            styleName="secondary"
                        />
                    </View> */}
            </View>
            <View
               style={{ height: 0.85714285714 * glyphWidth }}
               className="flex-row max-w-full flex-shrink flex-wrap h-auto px-8 flex-grow-0 -mb-9"
            >
               <View className="w-full  ">
                  <Button
                     text="Reveal Meaning"
                     onPress={() => {
                        if (!showMeaning) {
                           setShowMeaning(true)
                           fadeAnim.value = withTiming(1, {
                              duration: 300,
                           })
                           setTimeout(() => {
                              onCorrectChoice?.()
                           }, 500)
                        }
                     }}
                     styleName="normal"
                  />
               </View>
            </View>
         </Animated.View>
      </View>
   )
}

export default Intro
