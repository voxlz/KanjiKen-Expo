import { router } from 'expo-router'
import React, { FC } from 'react'
import { View } from 'react-native'
import StyledButton from '../src/components/StyledButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'
import { useContext } from '../src/utils/react'
import { glyphDict } from '../src/data/glyphDict'
import { learnOrder } from '../src/data/learnOrder'

type Props = {}

/** Homepage of the application. Where you start the exercises for example. */
const Home: FC<Props> = ({}) => {
    const scheduler = useContext(SchedulerContext)

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
            }}
        >
            <StyledButton
                text="Start Session"
                onPress={() => router.push('/session')}
            />
            {/* <StyledButton
                text="Dictionary"
                onPress={() => router.push('/dictionary')}
            /> */}
            <StyledButton
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
        </View>
    )
}

export default Home
