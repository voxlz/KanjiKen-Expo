import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { createContext, useContext } from '../utils/react'
import { ScheduleHandler } from '../ScheduleHandler'
import { View, Text } from 'react-native'
import { learnOrder } from '../data/learnOrder'
import { glyphDict } from '../data/glyphDict'
import { setDoc, doc, getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export const SchedulerContext = createContext<ScheduleHandler>()

/**  Keeps track of the scheduler. Initializes, loads and saves to disk.*/
const SchedulerContextProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [loaded, setLoaded] = useState(false)
    const scheduler = useRef(new ScheduleHandler()).current
    const db = getFirestore()
    const auth = getAuth()

    console.log('once')
    useEffect(() => {
        scheduler.loadFromDisk().then(() => {
            console.log('load from disk successful')
            setLoaded(true)
        })
    }, [])

    // Backup to server on startup
    useEffect(() => {
        if (loaded)
            if (!auth.currentUser) {
                console.log('sub to auth change')
                return auth.onAuthStateChanged((user) => {
                    console.log('auth state changed', user?.displayName)
                    if (user) {
                        scheduler.backupData()
                    }
                })
            } else {
                scheduler.backupData()
            }
    }, [loaded])

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
