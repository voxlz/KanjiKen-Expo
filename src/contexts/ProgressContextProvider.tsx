// import React, { FC, useState, ReactNode, useReducer, Dispatch } from 'react'
// import { ProgressDict } from '../types/progress'
// import { createContext } from '../utils/react'
// import { progressReducer } from '../reducers/progressReducer'

// type ProgressDispatchType = Dispatch<Parameters<typeof progressReducer>[1]>

// export const ProgressContext = createContext<ProgressDict>()
// export const ProgressDispatchContext = createContext<ProgressDispatchType>()

// const ProgressContextProvider: FC<{ children?: ReactNode }> = ({
//     children,
// }) => {
//     const [progress, setProgress] = useReducer(progressReducer, {})

//     return (
//         <ProgressDispatchContext.Provider value={setProgress}>
//             <ProgressContext.Provider value={progress}>
//                 {children}
//             </ProgressContext.Provider>
//         </ProgressDispatchContext.Provider>
//     )
// }
// export default ProgressContextProvider
