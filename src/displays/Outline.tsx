import React, { FC } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'

import TextView from '../components/TextView'

type Props = {
   text?: string
   style?: StyleProp<ViewStyle>
   dashed?: boolean
}

const Outline: FC<Props> = ({ text, style, dashed = true }) => {
   return (
      <Animated.View
         style={[
            style,
            {
               // Tailwind utils break dashed border on android
               borderStyle: dashed ? 'dashed' : 'solid',
               borderWidth: 3,
               borderRadius: 12,
               borderColor: 'rgb(174, 174, 174)',
            },
         ]}
         className="flex-grow flex-shrink bg-none items-center justify-center"
      >
         <TextView
            className="text-center text-ui-disabled text-4xl leading-none"
            text={text}
         />
      </Animated.View>
   )
}

export default Outline
