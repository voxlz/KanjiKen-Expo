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
import { useCallback, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import SchedulerContextProvider from '../src/contexts/SchedulerContextProvider'
import ChallengeContextProvider from '../src/contexts/ChallengeContextProvider'
import DragContextProvider from '../src/contexts/DragContextProvider'
import HealthContextProvider from '../src/contexts/HealthContextProvider'
import TaskAnimContextProvider from '../src/contexts/TaskAnimContextProvider'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import Button from '../src/components/Button'
export const version = Constants.expoConfig?.version

export default function Layout() {
    let [fontsLoaded] = useFonts({
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
    const [showChangelog, setShowChangelog] = useState(true)

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null
    }

    // Check if new version.
    AsyncStorage.getItem('version', (err, result) => {
        if (err) console.log('err.cause', err.cause)
        console.log('result', result)

        // First time opening the app
        if (result === null || result === '') {
            console.log('first time opening the app')
            // WELCOME TO KANJIKEN
        } else if (result === version) {
            console.log('same version as last time')
        } else {
            console.log('new version')
        }

        if (version) {
            AsyncStorage.setItem('version', version)
        } else {
            console.error('no version found')
        }
    })

    return (
        <View className="flex-1  bg-white" onLayout={onLayoutRootView}>
            {showChangelog && (
                <>
                    <View className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-25" />
                    <View
                        style={{ borderWidth: 0 }}
                        className="absolute bg-slate-100 top-16 bottom-12 left-5 right-5 z-20 rounded-xl justify-between border-forest-900"
                    >
                        <View className="p-8">
                            <Text className="text-xl font-noto-md">
                                Changelog
                            </Text>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                }}
                                className="mt-4 mb-8 opacity-20"
                            />
                        </View>
                        <View className="h-32 p-8">
                            <Button
                                text="Dissmiss"
                                onPress={() => setShowChangelog(false)}
                            />
                        </View>
                    </View>
                </>
            )}
            <GlyphWidthContextProvider>
                <SchedulerContextProvider>
                    <HealthContextProvider>
                        <DragContextProvider>
                            <TaskAnimContextProvider>
                                <ChallengeContextProvider>
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
                                </ChallengeContextProvider>
                            </TaskAnimContextProvider>
                        </DragContextProvider>
                    </HealthContextProvider>
                </SchedulerContextProvider>
            </GlyphWidthContextProvider>
        </View>
    )
}
