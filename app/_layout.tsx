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
            <SafeAreaView
                className="flex-1 py-4 bg-white"
                onLayout={onLayoutRootView}
            >
                <StatusBar backgroundColor="white" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'white', flexGrow: 1 },
                    }}
                    initialRouteName="/"
                />
            </SafeAreaView>
        </GlyphWidthContextProvider>
    )
}
