import React, { FC, ReactNode, useRef } from 'react'
import { createContext } from '../utils/react'
import { ScheduleHandler } from '../ScheduleHandler'

export const SchedulerContext = createContext<ScheduleHandler>()

const SchedulerContextProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const scheduler = useRef(new ScheduleHandler()).current
    return (
        <SchedulerContext.Provider value={scheduler}>
            {children}
        </SchedulerContext.Provider>
    )
}
export default SchedulerContextProvider
