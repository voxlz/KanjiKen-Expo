import { router, useFocusEffect } from 'expo-router'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import StyledButton from '../src/components/StyledButton'
import { version } from './_layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'

/** Homepage of the application. Where you start the exercises for example. */
const Home: FC<{}> = ({}) => {
    const [userName, setUserName] = useState<string>()
    const [userEmail, setUserEmail] = useState<string>()
    // const [serverTouch, setServerTouch] = useState<Date>()

    // const scheduler = useContext(SchedulerContext)

    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            updateUserInfo()
            // console.log(user)
            // if (user?.displayName) {
            //     setUserName(user.displayName)
            // scheduler
            //     .getBackupData()
            //     .then((data) => {
            //         if (
            //             data?.touched?.getTime() !== serverTouch?.getTime()
            //         ) {
            //             setServerTouch(data?.touched)
            //         }
            //     })
            //     .catch((error) => console.log(error))
            // }
        })
    }, [])

    const updateUserInfo = useCallback(() => {
        setUserName(auth().currentUser?.displayName ?? undefined)
        setUserEmail(auth().currentUser?.email ?? undefined)
    }, [])

    useFocusEffect(updateUserInfo)

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
                    {userEmail === 'torben.media@gmail.com' && (
                        <StyledButton
                            text="Developer"
                            styleName="disabled"
                            onPress={() => router.push('/developer')}
                        />
                    )}
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
                <Text className="text-md text-ui-light">
                    KanjiKen v{version}
                </Text>
                <Text className="text-md text-ui-light">
                    {userName !== null
                        ? `Logged in as: ${userName}`
                        : 'Not logged in'}{' '}
                </Text>
                {/* <Text className="text-md text-ui-light">
                    {userName !== null
                        ? `Last synced: `
                        : // ${
                          //       scheduler.getTouched()?.getTime() ===
                          //       serverTouch?.getTime()
                          //           ? 'Synced'
                          //           : serverTouch?.toString().slice(4, -8)
                          // }
                          //   `
                          'Never synced'}
                </Text> */}
            </View>
            <View className="mb-20 px-8">
                <StyledButton
                    text={!userName ? 'Sign in' : 'Sign out'}
                    styleName={!userName ? 'normal' : 'danger'}
                    onPress={() => {
                        if (!userName) {
                            router.push('/auth/login')
                        } else {
                            auth().signOut()
                            updateUserInfo()
                        }
                    }}
                />
            </View>
        </>
    )
}

export default Home
