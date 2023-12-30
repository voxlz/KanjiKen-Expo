import React, { FC } from 'react'
import { View } from 'react-native'

import TextView from './TextView'

/** Display this when the view is not ready yet */
const LoadingScreen: FC = () => (
   <View className="flex-grow justify-center items-center">
      <TextView>Loading</TextView>
   </View>
)

export default LoadingScreen
