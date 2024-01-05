import { useFocusEffect } from 'expo-router'
import React, {
   FC,
   PropsWithChildren,
   useCallback,
   useEffect,
   useState,
} from 'react'
import { View } from 'react-native'

import ClockIcon from '../../assets/icons/ph_clock-duotone.svg'
import SwordIcon from '../../assets/icons/ph_kanjiken-sword.svg'
import StyledButton from '../components/StyledButton'
import TextView from '../components/TextView'
import { SetChallengeContext } from '../contexts/ChallengeContextProvider'
import {
   RefreshHealthBarContext,
   SetHealthRegenContext,
   TimeTillFullHealthContext,
   HealthModeContext,
   OnSessionStartContext,
   HealthContext,
   maxHealth,
} from '../contexts/HealthContextProvider'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { useInterval } from '../hooks/useInterval'
import { useContext } from '../utils/react'

/** View before start of session, if not full health */
const LowHealth: FC<PropsWithChildren> = ({ children }) => {
   const timeTillFullHealth = useContext(TimeTillFullHealthContext)
   const refreshHealthbar = useContext(RefreshHealthBarContext)
   const setHealthRegen = useContext(SetHealthRegenContext)
   const scheduler = useContext(SchedulerContext)
   const setChallenge = useContext(SetChallengeContext)
   const healthMode = useContext(HealthModeContext)
   const onSessionStart = useContext(OnSessionStartContext)

   const [enoughHealth, setEnoughHealth] = useState(true)
   const [isLoading, setIsLoading] = useState(true)

   // UPDATE HEALTHBAR
   const update = useCallback(() => {
      return refreshHealthbar().then((health) => {
         setEnoughHealth(health >= 33)
         setIsLoading(false)
         return health
      })
   }, [refreshHealthbar])

   // Do exactly once. Skip lowHealth Screen if health has regenerated fully.
   useEffect(() => {
      if (isLoading)
         update().then((health) => {
            console.log('Health', health)
            if (health === 100) onSessionStart()
         })
   }, [isLoading, onSessionStart, update])

   useInterval(() => {
      if (healthMode === 'Regen') {
         update()
      }
   }, 250)

   // REGEN
   const startRegen = useCallback(() => {
      setHealthRegen(60)
   }, [])
   useFocusEffect(startRegen)

   return (
      <>
         {healthMode === 'Regen' && !isLoading ? (
            <View className="items-center justify-center w-full flex-grow ">
               <View
                  style={{ gap: 12 }}
                  className="px-8 flex-grow self-stretch"
               >
                  <View
                     className="items-center mt-8 flex-grow justify-start"
                     style={{ gap: 8 }}
                  >
                     {enoughHealth ? <SwordIcon /> : <ClockIcon />}
                     <View className="items-center mb-16 mt-10">
                        <TextView
                           className="text-black text-2xl"
                           style={{ fontFamily: 'noto-black' }}
                           text={enoughHealth ? 'Good to go' : 'Low Health'}
                        />
                        <TextView
                           style={{ fontFamily: 'noto-reg' }}
                           text={
                              timeTillFullHealth()
                                 ? 'Full health will finish restoring in ' +
                                   timeTillFullHealth()
                                 : 'Full health has been restored'
                           }
                        />
                     </View>
                  </View>
                  <StyledButton
                     styleName={enoughHealth ? 'forest' : 'disabled'}
                     text={
                        enoughHealth
                           ? 'Start Session'
                           : 'Health to low to start'
                     }
                     onPress={() => {
                        if (enoughHealth) {
                           setEnoughHealth(false)
                           onSessionStart()
                           const exercise = scheduler.getCurrent()
                           if (exercise) setChallenge(exercise)
                        }
                     }}
                  />
               </View>
            </View>
         ) : (
            <>{children}</>
         )}
      </>
   )
}

export default LowHealth
