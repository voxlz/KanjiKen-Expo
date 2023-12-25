import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { createContext } from '../utils/react'
import { ScheduleHandler } from '../scheduler/scheduleHandler'
import { View, Text } from 'react-native'

export const SchedulerContext = createContext<ScheduleHandler>()

/**  Keeps track of the scheduler. Initializes, loads and saves to disk.*/
const SchedulerContextProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [loaded, setLoaded] = useState(false)
    const scheduler = useRef(new ScheduleHandler()).current

    console.log('once')
    useEffect(() => {
        scheduler.syncLocal().then(() => {
            console.log('Local data loaded')
            setLoaded(true)
            scheduler.syncCloud().then(() => console.log('Cloud data synced'))
        })
    }, [])

    // // Backup to server on startup
    // useEffect(() => {
    //     if (loaded)
    //         if (!auth().currentUser) {
    //             console.log('sub to auth change')
    //             return auth().onAuthStateChanged((user) => {
    //                 console.log('auth state changed', user?.displayName)
    //                 if (user) {
    //                     scheduler.saveToCloud()
    //                 }
    //             })
    //         } else {
    //             scheduler.saveToCloud()
    //         }
    // }, [loaded])

    if (!loaded)
        return (
            <View className="flex-grow justify-center items-center">
                <Text>Loading</Text>
            </View>
        )

    return (
        <SchedulerContext.Provider value={scheduler}>
            {children}
        </SchedulerContext.Provider>
    )
}
export default SchedulerContextProvider
