import React, { FC, useState, ReactNode } from 'react'
import { ProgressDict } from '../types/progress'
import { createContext } from '../utils/react'

export const ProgressContext = createContext<ProgressDict>()

const ProgressContextProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [progress, setProgress] = useState<ProgressDict>({})

    return (
        <ProgressContext.Provider value={progress}>
            {children}
        </ProgressContext.Provider>
    )
}
export default ProgressContextProvider
