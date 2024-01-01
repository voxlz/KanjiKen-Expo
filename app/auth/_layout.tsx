import { Slot } from 'expo-router'
import React, { FC } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ExitBtn } from '../../src/components/HealthBar'

/** Wrapper view for login routes */
const _layout: FC = () => (
   <SafeAreaView className="flex-grow">
      <Pressable
         onPress={() => Keyboard.dismiss()}
         className="justify-center flex-grow flex-col px-8"
      >
         <View className="items-end mt-8">
            <ExitBtn height={20} />
         </View>
         <View className="flex-grow min-w-sm pb-20 mt-[20%]">
            <Slot />
         </View>
      </Pressable>
   </SafeAreaView>
)

export default _layout
