import { router } from 'expo-router'
import React, { FC, useCallback, useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import StyledButton from '../src/components/StyledButton'
import { version } from './_layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HealthBar from '../src/components/HealthBar'
import {
    RefreshHealthbarContext,
    SetHealthRegenContext,
} from '../src/contexts/HealthContextProvider'
import { useContext } from '../src/utils/react'
import { TimeTillFullHealthContext } from '../src/contexts/HealthContextProvider'
import { useFocusEffect } from 'expo-router'
import { getAuth, signOut } from 'firebase/auth'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'

type Props = {}

export function useInterval(callback: () => unknown, delay: number) {
    const savedCallback = useRef<() => unknown>()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current?.()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

/** Homepage of the application. Where you start the exercises for example. */
const Home: FC<Props> = ({}) => {
    const refreshHealthbar = useContext(RefreshHealthbarContext)
    const setHealthRegen = useContext(SetHealthRegenContext)
    const timeTillFullHealth = useContext(TimeTillFullHealthContext)
    const auth = getAuth()
    const scheduler = useContext(SchedulerContext)

    // UPDATE HEALTHBAR
    // useInterval(() => {
    //     refreshHealthbar()
    //     console.log('update')
    // }, 1000)

    // REGEN
    const startRegen = useCallback(() => {
        setHealthRegen(60)
    }, [])
    useFocusEffect(startRegen)

    // SHOW CHANGELOG IF NEW VERSION
    useEffect(() => {
        // Check if new version.
        AsyncStorage.getItem('version', (err, result) => {
            if (err) return console.log('err.cause', err.cause)

            console.log('result', result)

            // First time opening the app
            if (result === null || result === '') {
                console.log('first time opening the app')
                // WELCOME TO KANJIKEN
            } else if (result === version) {
                console.log('same version as last time')
            } else {
                console.log('new version')
                router.push('changelog')
            }

            if (version) {
                AsyncStorage.setItem('version', version)
            } else {
                console.error('no version found')
            }
        })
    }, [])

    return (
        <>
            <View
                style={{
                    flex: 1,
                    alignItems: 'stretch',
                    justifyContent: 'space-around',
                    gap: 12,
                }}
            >
                <View style={{ gap: 12 }} className="px-8">
                    <HealthBar />
                    <Text>{timeTillFullHealth()}</Text>
                </View>
                <View style={{ gap: 12 }} className="px-8">
                    <StyledButton
                        text="Start Session"
                        onPress={() => router.push('/session')}
                    />
                    <StyledButton
                        text="Discovered"
                        styleName="normal"
                        onPress={() => router.push('/discovery')}
                    />
                    <StyledButton
                        text="Changelog"
                        styleName="normal"
                        onPress={() => router.push('/changelog')}
                    />
                </View>
                {/* <View>
                    <StyledButton
                        styleName="normal"
                        text="Erase Progress"
                        onPress={() => {
                            console.log('deleted progress')
                            AsyncStorage.multiRemove(['progress', 'schedule'])
                            scheduler.clear()
                            scheduler.loadFromDisk().then(() => {
                                scheduler.initSchedule(
                                    learnOrder.map((glyph) => glyphDict[glyph])
                                )
                            })
                        }}
                    />
                </View> */}
            </View>
            <View className="items-center justify-center mb-6">
                <Text className="text-md text-ui-light">KanjiKen</Text>
                <Text className="text-md text-ui-light">Version {version}</Text>
                <Text className="text-md text-ui-light">
                    {auth.currentUser !== null
                        ? `Logged in as: ${auth.currentUser.displayName}`
                        : 'Not logged in'}{' '}
                </Text>
                <Text className="text-md text-ui-light">
                    {auth.currentUser !== null
                        ? `Last synced: ${''}`
                        : 'Not logged in'}{' '}
                </Text>
            </View>
            <View className="mb-20 px-8">
                <StyledButton
                    text={auth.currentUser === null ? 'Sign in' : 'Sign out'}
                    styleName={auth.currentUser === null ? 'normal' : 'danger'}
                    onPress={() => {
                        if (auth.currentUser === null) {
                            router.push('/auth/login')
                        } else {
                            signOut(auth)
                        }
                    }}
                />
            </View>
        </>
    )
}

export default Home
