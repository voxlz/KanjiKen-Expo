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
export const RefreshHealthBarContext = createContext<() => Promise<number>>()
export const TimeTillFullHealthContext =
    createContext<() => string | undefined>()
export const DeathContext = createContext<boolean>()
export const setIsDeadContext = createContext<(death: boolean) => void>()

export const SetHealthRegenContext =
    createContext<(regenPerMin: number) => void>()

/** Provides the drag context to elements that need it */
const HealthContextProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    // Keep track of stats
    const [health, _setHealth] = useState(30)
    const [maxHealth] = useState(30)
    const [regenCache, setRegenCache] = useState<RegenObj>()
    const [isDead, _setIsDead] = useState(false)

    const setIsDead = (newDead: boolean) => {
        _setIsDead((oldDead) => {
            if (newDead === true && oldDead !== newDead) onDeath()
            return newDead
        })
    }

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

    // Get regen object from storage
    const getRegenObj = async (): Promise<RegenObj> => {
        const regenStr = await AsyncStorage.getItem('regen')
        if (!regenStr)
            return { timeOfQuit: 0, healthPerMin: 0, healthLeftAtQuit: 0 }
        return JSON.parse(regenStr)
    }

    // Set regen obj to storage
    const setRegenObj = (regenObj: RegenObj) => {
        AsyncStorage.setItem('regen', JSON.stringify(regenObj)).then(() =>
            setRegenCache(regenObj)
        )
    }

    /** Calculate how much health has been gained since timeOfDeath given current regen rate */
    const getRegenHealth = async () => {
        const regen = await getRegenObj()
        const healthPerSec = regen.healthPerMin / 60
        const secondsPassed = (Date.now() - regen.timeOfQuit) / 1000

        console.log('seconds passed', secondsPassed, regen.timeOfQuit)

        const value = regen.healthLeftAtQuit + healthPerSec * secondsPassed
        const max = maxHealth
        const min = 0
        // console.log('value', value, max, maxHealth, health)

        // Make sure this does not push health beyond max.
        return clamp({
            min: min,
            value: value,
            max: max,
        })
    }

    /** Call this to get an accurate readout on health */
    const refreshHealthBar = async () => {
        const regen = await getRegenHealth()
        console.log('regen', regen)
        let newHealth: number = regen
        if (newHealth <= 0) onDamage(true)
        if (newHealth >= 0.33 * maxHealth)
            healthColor.value = withSpring(1, {
                duration: 500,
            })

        setHealth(() => newHealth)
        return (newHealth / maxHealth) * 100
    }

    /** Change health */
    const addHealth = async (diff: number) => {
        // console.log('added health', diff)
        setHealth((health) => {
            const newHealth = clamp({
                min: 0,
                value: health + diff,
                max: maxHealth,
            })

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
        getRegenObj().then((regenObj): void => {
            regenObj.healthPerMin = regenPerMin
            setRegenObj(regenObj)
        })
    }

    // What should happen on death
    const onDeath = () => {
        console.log('onSessionEnd')
        getRegenObj().then((regenObj): void => {
            regenObj.timeOfQuit = Date.now()
            regenObj.healthLeftAtQuit = health
            setRegenObj(regenObj)
            setIsDead(true)
        })
    }

    // What should happen on damage
    const onDamage = (isDead: boolean) => {
        console.log('onDamage')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        if (healthColor.value !== 0) {
            healthColor.value = 0
            if (!isDead) {
                healthColor.value = withDelay(
                    300,
                    withSpring(1, {
                        duration: 500,
                    })
                )
            }
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

    return (
        <DeathContext.Provider value={isDead}>
            <setIsDeadContext.Provider value={setIsDead}>
                <AddHealthContext.Provider value={addHealth}>
                    <HealthColorContext.Provider value={healthColor}>
                        <RelativeHealthContext.Provider value={healthProcent}>
                            <RefreshHealthBarContext.Provider
                                value={refreshHealthBar}
                            >
                                <SetHealthRegenContext.Provider
                                    value={setHealthRegen}
                                >
                                    <TimeTillFullHealthContext.Provider
                                        value={timeTillFullHealth}
                                    >
                                        {children}
                                    </TimeTillFullHealthContext.Provider>
                                </SetHealthRegenContext.Provider>
                            </RefreshHealthBarContext.Provider>
                        </RelativeHealthContext.Provider>
                    </HealthColorContext.Provider>
                </AddHealthContext.Provider>
            </setIsDeadContext.Provider>
        </DeathContext.Provider>
    )
}

export type RegenObj = {
    timeOfQuit: number
    healthLeftAtQuit: number
    healthPerMin: number
}

export default HealthContextProvider
