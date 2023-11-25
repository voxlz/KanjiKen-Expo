import { Stack } from 'expo-router/stack'
import GlyphWidthContextProvider from '../src/contexts/GlyphWidthContextProvider'
import { SplashScreen } from 'expo-router'
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
import { useFonts } from 'expo-font'
import { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import SchedulerContextProvider from '../src/contexts/SchedulerContextProvider'
import ChallengeContextProvider from '../src/contexts/ChallengeContextProvider'
import DragContextProvider from '../src/contexts/DragContextProvider'
import HealthContextProvider from '../src/contexts/HealthContextProvider'
import TaskAnimContextProvider from '../src/contexts/TaskAnimContextProvider'
import { View } from 'react-native'

export default function Layout() {
    let [fontsLoaded] = useFonts({
        NotoSansJP_100Thin,
        NotoSansJP_300Light,
        NotoSansJP_400Regular,
        NotoSansJP_500Medium,
        NotoSansJP_700Bold,
        NotoSansJP_900Black,
        KleeOne_400Regular,
        KleeOne_600SemiBold,
        'KanjiKen-Regular': require('./../assets/fonts/KanjiKen-Regular.ttf'),
    })

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null
    }
    return (
        <GlyphWidthContextProvider>
            <SchedulerContextProvider>
                <HealthContextProvider>
                    <DragContextProvider>
                        <TaskAnimContextProvider>
                            <ChallengeContextProvider>
                                <View
                                    className="flex-1 py-4 mt-10 bg-white"
                                    onLayout={onLayoutRootView}
                                >
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
                                </View>
                            </ChallengeContextProvider>
                        </TaskAnimContextProvider>
                    </DragContextProvider>
                </HealthContextProvider>
            </SchedulerContextProvider>
        </GlyphWidthContextProvider>
    )
}
