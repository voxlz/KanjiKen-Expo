import React, { FC } from 'react'
import { View, Text, StyleProp, ViewStyle } from 'react-native'

type Props = {
   text: string
   style: StyleProp<ViewStyle>
   className: React.HTMLAttributes<View>
}

/** Forgot to write a component discription. */
const TextCenter: FC<Props> = ({ text, style }) => (
   <View
      style={[
         {
            flexGrow: 1,
            flexShrink: 1,
         },
         style,
      ]}
   >
      {/* Oh this? This bad boy is to ensure smooth text animation when rescaling the width and height.  I love web dev.*/}
      <View className="flex-grow" />
      <View className="flex-row">
         <View className="flex-grow" />
         <View>
            <Text
               style={{ fontFamily: 'klee-bold' }}
               className=" text-ui-text text-4xl leading-none"
            >
               {text}
            </Text>
         </View>
         <View className="flex-grow " />
      </View>
      <View className="flex-grow " />
   </View>
)

export default TextCenter
