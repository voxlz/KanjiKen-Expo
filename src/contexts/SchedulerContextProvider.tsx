import auth from '@react-native-firebase/auth'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'

import ScheduleHandler from '../scheduler/scheduleHandler'
import { createContext } from '../utils/react'
import LoadingScreen from '../components/LoadingScreen'

export const SchedulerContext = createContext<ScheduleHandler>()

let currentUserEmail: string | undefined = undefined

/**  Keeps track of the scheduler. Initializes, loads and saves to disk.*/
const SchedulerContextProvider: FC<{ children?: ReactNode }> = ({
   children,
}) => {
   const [loaded, setLoaded] = useState(false)
   const scheduler = useRef(new ScheduleHandler()).current

   useEffect(() => {
      const sync = () =>
         scheduler.syncLocal().then(() => {
            setLoaded(true)
            scheduler.syncCloud()
         })

      scheduler.syncLocal().then(() => {
         setLoaded(true)
      })

      return auth().onAuthStateChanged((user) => {
         if (currentUserEmail !== user?.email ?? 'NEW USER') {
            if (user) {
               console.log('---------------- AUTH STATE CHANGED')
               currentUserEmail = user.email ?? ''
               sync()
                  .then(() => console.log('synced'))
                  .catch((e) => console.warn('something went wrong', e))
            } else {
               currentUserEmail = undefined
            }
         }
      })
   })

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

   if (!loaded) return <LoadingScreen />

   return (
      <SchedulerContext.Provider value={scheduler}>
         {children}
      </SchedulerContext.Provider>
   )
}

export default SchedulerContextProvider
