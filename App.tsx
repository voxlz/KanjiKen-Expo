import { StatusBar } from 'expo-status-bar'
import {
    useFonts,
    NotoSansJP_100Thin,
    NotoSansJP_300Light,
    NotoSansJP_400Regular,
    NotoSansJP_500Medium,
    NotoSansJP_700Bold,
    NotoSansJP_900Black,
} from '@expo-google-fonts/noto-sans-jp'
import {
    KleeOne_400Regular,
    KleeOne_600SemiBold,
} from '@expo-google-fonts/klee-one'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import DragContextProvider from './src/contexts/DragContextProvider'
import ChallengeContextProvider from './src/contexts/ChallengeContextProvider'
import Session from './src/views/Session'
import HealthContextProvider from './src/contexts/HealthContextProvider'
import Animated from 'react-native-reanimated'
import TaskAnimContextProvider from './src/contexts/TaskAnimContextProvider'

// Used for web to render tailwind
// import "./src/input";

export default function App() {
    let [fontsLoaded] = useFonts({
        NotoSansJP_100Thin,
        NotoSansJP_300Light,
        NotoSansJP_400Regular,
        NotoSansJP_500Medium,
        NotoSansJP_700Bold,
        NotoSansJP_900Black,
        KleeOne_400Regular,
        KleeOne_600SemiBold,
    })

    // useEffect(() => {
    //     setGlyphDict(gd())
    // }, [])

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null
    }

    return (
        <Animated.View className="flex-1 bg-white" onLayout={onLayoutRootView}>
            <GestureHandlerRootView className="w-full h-full max-w-full max-h-full">
                <StatusBar style="auto" />
                <HealthContextProvider>
                    <DragContextProvider>
                        <TaskAnimContextProvider>
                            <ChallengeContextProvider>
                                {/* <ProgressContextProvider> */}
                                <Session />
                                {/* </ProgressContextProvider> */}
                            </ChallengeContextProvider>
                        </TaskAnimContextProvider>
                    </DragContextProvider>
                </HealthContextProvider>
            </GestureHandlerRootView>
        </Animated.View>
    )
}
