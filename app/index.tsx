import { router } from 'expo-router'
import React, { FC, useEffect } from 'react'
import { View, Text } from 'react-native'
import StyledButton from '../src/components/StyledButton'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'
import { useContext } from '../src/utils/react'
import { version } from './_layout'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Props = {}

/** Homepage of the application. Where you start the exercises for example. */
const Home: FC<Props> = ({}) => {
    useEffect(() => {
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
                <View style={{ gap: 12 }}>
                    <StyledButton
                        text="Start Session"
                        onPress={() => router.push('/session')}
                    />
                    <StyledButton
                        text="Discovered"
                        onPress={() => router.push('/discovery')}
                    />
                    <StyledButton
                        text="Changelog"
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
            <View className="items-center justify-center mb-20">
                <Text className="text-md text-ui-light">KanjiKen</Text>
                <Text className="text-md text-ui-light">Version {version}</Text>
            </View>
        </>
    )
}

export default Home
