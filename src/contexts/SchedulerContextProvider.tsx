import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { createContext, useContext } from '../utils/react'
import { ScheduleHandler } from '../ScheduleHandler'
import { View, Text } from 'react-native'
import { learnOrder } from '../data/learnOrder'
import { glyphDict } from '../data/glyphDict'

export const SchedulerContext = createContext<ScheduleHandler>()

/**  Keeps track of the scheduler. Initializes, loads and saves to disk.*/
const SchedulerContextProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [loaded, setLoaded] = useState(false)
    const scheduler = useRef(new ScheduleHandler()).current

    useEffect(() => {
        scheduler.loadFromDisk().then(() => {
            console.log('load from disk successful')
            if (!scheduler.hasSchedule) {
                const learnInfoArr = learnOrder.map((glyph) => glyphDict[glyph])
                scheduler.initSchedule(learnInfoArr)
            }
            setLoaded(true)
        })
    }, [])

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
