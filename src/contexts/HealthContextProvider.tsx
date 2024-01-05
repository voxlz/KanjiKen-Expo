import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Haptics from 'expo-haptics'
import React, { FC, useCallback, useEffect, useState } from 'react'
import {
   SharedValue,
   useSharedValue,
   withDelay,
   withSpring,
   withTiming,
} from 'react-native-reanimated'

import { SchedulerContext } from './SchedulerContextProvider'
import { clamp } from '../utils/js'
import { createContext, useContext } from '../utils/react'

type HealthMode = 'Session' | 'Regen'

export const HealthContext = createContext<number>()
export const RelativeHealthContext = createContext<SharedValue<number>>()
export const HealthColorContext = createContext<SharedValue<number>>()
export const AddHealthContext = createContext<(health: number) => void>()
export const RefreshHealthBarContext = createContext<() => Promise<number>>()
export const HealthModeContext = createContext<HealthMode>('Session')
export const OnSessionEndContext = createContext<(health?: number) => void>()
export const OnSessionStartContext = createContext<() => void>()
export const TimeTillFullHealthContext =
   createContext<() => string | undefined>()

// Limit damage to once per exercise
export const NewExerciseHealthContext = createContext<() => void>()

export const SetHealthRegenContext =
   createContext<(regenPerMin: number) => void>()

const maxHealth = 30

/** Provides the drag context to elements that need it */
const HealthContextProvider: FC<{ children?: React.ReactNode }> = ({
   children,
}) => {
   const scheduler = useContext(SchedulerContext)

   // Keep track of stats
   const [health, _setHealth] = useState(30)
   const [regenCache, setRegenCache] = useState<RegenObj>()
   const [loading, setLoading] = useState(true)
   const [takeDamage, setTakeDamage] = useState(true)
   const [healthMode, setHealthMode] = useState<HealthMode>('Session')

   // Animation variables
   const healthProcent = useSharedValue((health / maxHealth) * 100)
   const healthColor = useSharedValue(1)

   // Instantly set health on load (Without animation)
   useEffect(() => {
      if (loading) {
         AsyncStorage.getItem('health', (err, res) => {
            if (err) console.warn(err)
            else if (res) {
               console.log('set Helth INSTANT')
               _setHealth(JSON.parse(res))
               healthProcent.value = (health / maxHealth) * 100
            } else {
               healthProcent.value = 100
               _setHealth(maxHealth)
            }
         }).then(() => setLoading(false))
      } else {
         console.log('set Health')
         healthProcent.value = withTiming((health / maxHealth) * 100, {
            duration: 500,
         })
      }
   }, [health, healthProcent, loading])

   /** Sets health according to some lambda. Saves health to disk */
   const setHealth = (someFunc: (oldHealth: number) => number) => {
      const newHealth = someFunc(health)
      AsyncStorage.setItem('health', JSON.stringify(newHealth))
      _setHealth(newHealth)
   }

   /** Get regen object from storage */
   const getRegenObj = async (): Promise<RegenObj> => {
      const regenStr = await AsyncStorage.getItem('regen')
      if (!regenStr)
         return { timeOfQuit: 0, healthPerMin: 60, healthLeftAtQuit: 1000 }
      return JSON.parse(regenStr)
   }

   /** Set regen obj to storage */
   const setRegenObj = (regenObj: RegenObj) => {
      AsyncStorage.setItem('regen', JSON.stringify(regenObj)).then(() =>
         setRegenCache(regenObj)
      )
   }

   /**
    * Calculate how much health has been gained since timeOfDeath given current regen rate 
    */
   const getRegenHealth = async () => {
      const regen = await getRegenObj()
      const healthPerSec = regen.healthPerMin / 60
      const secondsPassed = (Date.now() - regen.timeOfQuit) / 1000

      console.log('Regen: seconds since onSessionEnd', secondsPassed)

      const value = regen.healthLeftAtQuit + healthPerSec * secondsPassed
      const max = maxHealth
      const min = 0

      // Make sure this does not push health beyond max.
      return clamp({
         min,
         value,
         max,
      })
   }

   /** Call this to get an accurate readout on health */
   const refreshHealthBar = async () => {
      const regen = await getRegenHealth()
      const newHealth: number = regen
      if (newHealth <= 0) onDamage(newHealth)
      if (newHealth >= 0.33 * maxHealth)
         healthColor.value = withSpring(1, {
            duration: 500,
         })

      setHealth(() => newHealth)

      console.log('REFRESH NEW HEALTH', newHealth)
      return (newHealth / maxHealth) * 100
   }

   /** Change health */
   const addHealth = async (diff: number) => {
      console.log('added health', diff)
      let newHealth: number

      // Update Health
      setHealth((oldHealth) => {
         newHealth = oldHealth

         // Check if you can take damage
         if (takeDamage) {
            newHealth = clamp({
               min: 0,
               value: oldHealth + diff,
               max: maxHealth,
            })
            setTakeDamage(false)
         }

         return newHealth
      })

      // You took damage
      if (diff < 0) {
         onDamage(newHealth!)
      }
   }

   const setHealthRegen = (regenPerMin: number) => {
      getRegenObj().then((regenObj): void => {
         regenObj.healthPerMin = regenPerMin
         setRegenObj(regenObj)
      })
   }

   /**
    * Session is over.
    * User may have died or quit. Regardless this should sync data and put health into "REGEN" mode
    **/
   const onSessionEnd = useCallback(
      (newHealth?: number) => {
         console.log('onSessionEnd()')
         scheduler.syncLocal()
         scheduler.syncCloud()
         getRegenObj().then((regenObj): void => {
            regenObj.timeOfQuit = Date.now()
            regenObj.healthLeftAtQuit = newHealth ?? health
            setRegenObj(regenObj)
            setHealthMode('Regen')
         })
      },
      [health, scheduler]
   )

   /**
    * Session is starting. User has triggered a new session start. Set health into "SESSION" mode.
    */
   const onSessionStart = useCallback(() => {
      console.log('onSessionStart()')
      setHealthMode('Session')
   }, [])

   /**
    * User has taken damage.
    * @param newHealth the new health. (Health and animations may be delayed)
    */
   const onDamage = (newHealth: number) => {
      console.log('onDamage')

      // Give feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

      // Update health color. Switch to red, If still alive, fade back to green
      healthColor.value = 0
      if (newHealth > 0) {
         healthColor.value = withDelay(
            300,
            withSpring(1, {
               duration: 500,
            })
         )
      }
   }

   const timeTillFullHealth = () => {
      if (!regenCache) return 'error'
      if (maxHealth - health === 0) return undefined
      const minLeft = (maxHealth - health) / regenCache?.healthPerMin
      if (minLeft > 0 && minLeft < 1)
         return `${(minLeft * 60).toFixed(0)} seconds`
      return `~${minLeft.toFixed(0)} min`
   }

   const resetTakeDamage = useCallback(() => {
      setTakeDamage(true)
   }, [])

   return (
      <NewExerciseHealthContext.Provider value={resetTakeDamage}>
         <HealthModeContext.Provider value={healthMode}>
            <AddHealthContext.Provider value={addHealth}>
               <HealthColorContext.Provider value={healthColor}>
                  <RelativeHealthContext.Provider value={healthProcent}>
                     <RefreshHealthBarContext.Provider value={refreshHealthBar}>
                        <SetHealthRegenContext.Provider value={setHealthRegen}>
                           <TimeTillFullHealthContext.Provider
                              value={timeTillFullHealth}
                           >
                              <OnSessionStartContext.Provider
                                 value={onSessionStart}
                              >
                                 <OnSessionEndContext.Provider
                                    value={onSessionEnd}
                                 >
                                    <HealthContext.Provider value={health}>
                                       {children}
                                    </HealthContext.Provider>
                                 </OnSessionEndContext.Provider>
                              </OnSessionStartContext.Provider>
                           </TimeTillFullHealthContext.Provider>
                        </SetHealthRegenContext.Provider>
                     </RefreshHealthBarContext.Provider>
                  </RelativeHealthContext.Provider>
               </HealthColorContext.Provider>
            </AddHealthContext.Provider>
         </HealthModeContext.Provider>
      </NewExerciseHealthContext.Provider>
   )
}

export type RegenObj = {
   timeOfQuit: number
   healthLeftAtQuit: number
   healthPerMin: number
}

export default HealthContextProvider
