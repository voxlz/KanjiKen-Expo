import React, { FC } from 'react'
import { View, Text } from 'react-native'

type Props = {
   seenCount: number
   text: string
}

/** Display challenge title and challenge number */
const StatusBar: FC<Props> = ({ seenCount, text }) => (
   <View
      className="flex-row justify-between  px-9 basis-10 items-start"
      style={{ gap: 4 }}
   >
      <Text
         style={{ fontFamily: 'noto-bold' }}
         className="text-xl capitalize text-forest-900"
      >
         {text}
      </Text>
      {/* <Text
            style={{ fontFamily: 'NotoSansJP_400Regular' }}
            className="text-xl capitalize"
        >
            {seenCount}/20
        </Text> */}
   </View>
)

export default StatusBar
