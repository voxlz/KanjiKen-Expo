import React, { FC, useEffect, useState } from 'react'
import * as Haptics from 'expo-haptics'
import {
    SharedValue,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { createContext } from '../utils/react'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { clamp } from '../utils/js'

export const RelativeHealthContext = createContext<SharedValue<number>>()
export const HealthColorContext = createContext<SharedValue<number>>()
export const AddHealthContext = createContext<(health: number) => void>()
export const RefreshHealthbarContext = createContext<() => Promise<void>>()
export const TimeTillFullHealthContext = createContext<() => string>()
export const SetHealthRegenContext =
    createContext<(regenPerMin: number) => void>()

/** Provides the drag context to elements that need it */
const HealthContextProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    // Keep track of stats
    const [health, _setHealth] = useState(30)
    const [maxHealth] = useState(30)
    const [regenCashe, setRegenCashe] = useState<RegenObj>()

    // console.log('health', health)

    // Animation variables
    const healthProcent = useSharedValue((health / maxHealth) * 100)
    const healthColor = useSharedValue(1)
    useEffect(() => {
        healthProcent.value = withTiming((health / maxHealth) * 100)
    }, [health])

    useEffect(() => {
        AsyncStorage.getItem('health', (err, res) => {
            if (res) {
                _setHealth(JSON.parse(res))
            }
        })
    }, [])

    const setHealth = (someFunc: (oldHealth: number) => number) => {
        const newHealth = someFunc(health)
        AsyncStorage.setItem('health', JSON.stringify(newHealth))
        _setHealth(newHealth)
    }

    const getRegenObj = async () => {
        const regenStr = await AsyncStorage.getItem('regen')
        if (!regenStr) return { start: Date.now(), healthPerMin: 0 }
        return JSON.parse(regenStr) as RegenObj
    }

    /** Calculate how much health has been gained since regen started */
    const getRegenHealth = async () => {
        const regen = await getRegenObj()
        const healthPerSec = regen.healthPerMin / 60
        const secondsPassed = (Date.now() - regen.start) / 1000

        const value = healthPerSec * secondsPassed
        const max = maxHealth - health
        const min = 0 - health
        // console.log('value', value, max, maxHealth, health)

        // Make sure this does not push health beyond max.
        return clamp({
            min: min,
            value: value,
            max: max,
        })
    }

    /** Call this to get an accurate readout on health */
    const refreshHealthbar = async () => {
        const regen = await getRegenHealth()
        // console.log('regen', regen)
        setHealth((health) => {
            const newHealth = health + regen
            if (newHealth <= 0) onDamage(true)
            if (newHealth >= 0.33 * maxHealth)
                healthColor.value = withSpring(1, {
                    duration: 500,
                })

            return newHealth
        })

        // Reset regen
        getRegenObj().then((regenObj) => {
            setHealthRegen(regenObj.healthPerMin)
        })
    }

    /** Change health */
    const addHealth = async (diff: number) => {
        // console.log('added health', diff)
        setHealth((health) => {
            const newHealth = health + diff

            // You took damage
            if (diff < 0) {
                onDamage(newHealth <= 0)
            }

            // Reset regen
            getRegenObj().then((regenObj) => {
                setHealthRegen(regenObj.healthPerMin)
            })

            return newHealth
        })
    }

    const setHealthRegen = (regenPerMin: number) => {
        const regenObj: RegenObj = {
            start: Date.now(),
            healthPerMin: regenPerMin,
        }
        setRegenCashe(regenObj)
        AsyncStorage.setItem('regen', JSON.stringify(regenObj))
    }

    const onDamage = (isDead: boolean) => {
        if (healthColor.value !== 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            healthColor.value = 0
            if (!isDead) {
                healthColor.value = withDelay(
                    300,
                    withSpring(1, {
                        duration: 500,
                    })
                )
            } else {
                setTimeout(() => router.back(), 500)
            }
        }
    }

    const timeTillFullHealth = () => {
        if (!regenCashe) return 'error'
        if (maxHealth - health === 0) return ''
        const aa = (maxHealth - health) / regenCashe?.healthPerMin
        if (aa > 0 && aa < 1) return '>1 min till full health'
        return `~${aa.toFixed(0)} min till full health`
    }

    return (
        <AddHealthContext.Provider value={addHealth}>
            <HealthColorContext.Provider value={healthColor}>
                <RelativeHealthContext.Provider value={healthProcent}>
                    <RefreshHealthbarContext.Provider value={refreshHealthbar}>
                        <SetHealthRegenContext.Provider value={setHealthRegen}>
                            <TimeTillFullHealthContext.Provider
                                value={timeTillFullHealth}
                            >
                                {children}
                            </TimeTillFullHealthContext.Provider>
                        </SetHealthRegenContext.Provider>
                    </RefreshHealthbarContext.Provider>
                </RelativeHealthContext.Provider>
            </HealthColorContext.Provider>
        </AddHealthContext.Provider>
    )
}

export type RegenObj = {
    start: number
    healthPerMin: number
}

export default HealthContextProvider
