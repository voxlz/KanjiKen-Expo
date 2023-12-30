import { Slot } from 'expo-router'
import React, { FC } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ExitBtn } from '../../src/components/HealthBar'

type Props = object

/** Wrapper view for login routes */
const _layout: FC<Props> = ({}) => (
   <SafeAreaView className="flex-grow">
      <Pressable
         onPress={() => Keyboard.dismiss()}
         className="justify-center flex-grow"
      >
         <View className="items-start absolute top-8 left-8">
            <ExitBtn height={20} />
         </View>
         <View className="px-6 w-[400px] m-auto min-w-sm max-w-[90%] pb-20 ">
            <Slot />
         </View>
      </Pressable>
   </SafeAreaView>
)

export default _layout
