import {
   KleeOne_400Regular,
   KleeOne_600SemiBold,
} from '@expo-google-fonts/klee-one'
import {
   NotoSansJP_100Thin,
   NotoSansJP_300Light,
   NotoSansJP_400Regular,
   NotoSansJP_500Medium,
   NotoSansJP_700Bold,
   NotoSansJP_900Black,
} from '@expo-google-fonts/noto-sans-jp'
import Constants from 'expo-constants'
import { useFonts } from 'expo-font'
import { SplashScreen } from 'expo-router'
import { Stack } from 'expo-router/stack'
import { StatusBar } from 'expo-status-bar'
import { useCallback } from 'react'
import { View } from 'react-native'

import ChallengeContextProvider from '../src/contexts/ChallengeContextProvider'
import GlyphWidthContextProvider from '../src/contexts/GlyphWidthContextProvider'
import HealthBarStateProvider from '../src/contexts/HealthContextProvider'
import SchedulerContextProvider from '../src/contexts/SchedulerContextProvider'
import AnimationContextProvider from '../src/contexts/TaskAnimContextProvider'

export const version = Constants.expoConfig?.version

export default function Layout() {
   // FONTS
   const [fontsLoaded] = useFonts({
      'noto-thin': NotoSansJP_100Thin,
      'noto-light': NotoSansJP_300Light,
      'noto-reg': NotoSansJP_400Regular,
      'noto-md': NotoSansJP_500Medium,
      'noto-bold': NotoSansJP_700Bold,
      'noto-black': NotoSansJP_900Black,
      'klee-reg': KleeOne_400Regular,
      'klee-bold': KleeOne_600SemiBold,
      'KanjiKen-Regular': require('./../assets/fonts/KanjiKen-Regular.ttf'),
   })

   // SPLASH
   const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded) {
         await SplashScreen.hideAsync()
      }
   }, [fontsLoaded])

   if (!fontsLoaded) {
      return null
   }
   return (
      <View className="flex-1  bg-white" onLayout={onLayoutRootView}>
         <GlyphWidthContextProvider>
            <SchedulerContextProvider>
               <AnimationContextProvider>
                  <ChallengeContextProvider>
                     <HealthBarStateProvider>
                        <StatusBar backgroundColor="white" />
                        <Stack
                           screenOptions={{
                              headerShown: false,
                              contentStyle: {
                                 backgroundColor: 'white',
                                 flexGrow: 1,
                              },
                           }}
                           initialRouteName="/home"
                        />
                     </HealthBarStateProvider>
                  </ChallengeContextProvider>
               </AnimationContextProvider>
            </SchedulerContextProvider>
         </GlyphWidthContextProvider>
      </View>
   )
}
