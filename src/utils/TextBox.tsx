import React, { FC } from 'react'
import { View, Text } from 'react-native'

type Props = {
   text: string
   textClasses?: React.HTMLAttributes<View>['className']
   boxClasses?: React.HTMLAttributes<View>['className']
}

/** Forgot to write a component discription. */
const TextBox: FC<Props> = ({ text, boxClasses, textClasses }) => (
   <View className={boxClasses ?? ' ' + ' flex-grow justify-center'}>
      <Text className={textClasses ?? ' ' + ' text-center'} children={text} />
   </View>
)

export default TextBox
