import React, { FC, useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, {
   SharedValue,
   useAnimatedStyle,
} from 'react-native-reanimated'

import TextView from '../components/TextView'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { useContext } from '../utils/react'

type Props = {
   text?: string
   style?: StyleProp<ViewStyle>
   dashed?: boolean
   isNext?: SharedValue<boolean>
   isHovered?: SharedValue<boolean>
}

const Outline: FC<Props> = ({
   text,
   style,
   dashed = true,
   isNext,
   isHovered,
}) => {
   const scheduler = useContext(SchedulerContext)
   const isNotRecognizeSkill = useMemo(
      () => scheduler.getCurrent()?.skill !== 'recognize',
      [scheduler]
   )
   const animatedState = useAnimatedStyle(() => {
      const color = `rgba(174, 174, 174, ${isHovered?.value ? 1 : 0.8})`
      const bg = `rgba(243, 244, 246, 0.5)`
      return {
         borderColor: color,
         backgroundColor: isNext?.value && isNotRecognizeSkill ? bg : undefined,
         transform: [{ scale: isHovered?.value ? 1.01 : 1 }],
      }
   }, [isNext, isHovered])

   return (
      <Animated.View
         style={[
            style,
            {
               // Tailwind utils break dashed border on android
               borderStyle: dashed ? 'dashed' : 'solid',
               borderWidth: 3,
               borderRadius: 12,
            },
            animatedState,
         ]}
         className="flex-grow flex-shrink bg-none items-center justify-center"
      >
         <TextView
            className="text-center text-ui-disabled text-4xl leading-none"
            text={text}
            style={{
               fontFamily:
                  text?.trim() === '?' ? 'KanjiKen-Regular' : undefined,
            }}
         />
      </Animated.View>
   )
}

export default Outline
