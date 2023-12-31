import { router } from 'expo-router'
import React, { FC } from 'react'
import { Pressable } from 'react-native'
import Animated, {
   interpolateColor,
   useAnimatedStyle,
} from 'react-native-reanimated'

import SVGImg from '../../assets/icons/ph_x-circle-duotone.svg'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import {
   RelativeHealthContext,
   HealthColorContext,
} from '../contexts/HealthContextProvider'
import { useContext } from '../utils/react'

type Props = object

/** Keeps track of current health */

export function ExitBtn({
   height,
   onPress,
}: {
   height: number
   onPress?: () => void
}) {
   return (
      <Pressable
         onPress={() => {
            onPress?.()
            router.back()
         }}
      >
         <SVGImg width={height * 1.5} height={height * 1.5} />
      </Pressable>
   )
}

const HealthBar: FC<Props> = () => {
   const relativeHealth = useContext(RelativeHealthContext)
   const healthColor = useContext(HealthColorContext)
   const glyphWidth = useContext(GlyphWidthContext)

   const height = glyphWidth / 3

   const healthBarStyle = useAnimatedStyle(() => {
      if (healthColor && relativeHealth) {
         const healthLight = interpolateColor(
            healthColor.value,
            [0, 1],
            ['rgba(228, 106, 106, 1)', 'rgba(204, 232, 174, 1)']
         )
         return {
            backgroundColor: healthLight,
            height: height - 6,
            width: `${relativeHealth.value}%`,
         }
      } else return {}
   })

   const healthBackground = useAnimatedStyle(() => {
      if (healthColor && relativeHealth) {
         const background = interpolateColor(
            healthColor.value,
            [0, 1],
            ['#B03A3A', 'rgba(83, 136, 40, 1)']
         )
         const border = interpolateColor(
            healthColor.value,
            [0, 1],
            ['#6C2424', '#46622F']
         )
         return {
            backgroundColor: background,
            borderColor: border,
            borderRadius: 9,
            height,
            flexGrow: 1,
         }
      } else return {}
   })

   return (
      <Animated.View
         style={healthBackground}
         className="flex-grow border-[3px] items-end justify-center"
      >
         {/* <Text className=" text-forest-200">300</Text> */}
         <Animated.View
            style={healthBarStyle}
            className="absolute rounded-md items-end justify-center inset-3 self-start"
         >
            {/* <Text className="text-forest-800">200</Text> */}
         </Animated.View>
      </Animated.View>
   )
}

export default HealthBar
