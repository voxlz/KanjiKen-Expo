import React, { FC, useState } from 'react'
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

export const RelativeHealthContext = createContext<SharedValue<number>>()
export const HealthColorContext = createContext<SharedValue<number>>()
export const AddHealthContext = createContext<(health: number) => void>()

/** Provides the drag context to elements that need it */
const HealthContextProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const [health, setHealth] = useState(40)
    const [maxHealth] = useState(40)

    const healthProcent = useSharedValue((health / maxHealth) * 100)
    const healthColor = useSharedValue(1)

    const addHealth = (diff: number) => {
        console.log('added health', diff)
        const newHealth = health + diff
        healthProcent.value = withTiming((newHealth / maxHealth) * 100)
        const isDead = newHealth <= 0

        // You took damage
        if (diff < 0) {
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
            // healthColor.value = withDelay(750, withTiming(1, { duration: 100 }));
        }

        setHealth((h) => h + diff)
    }

    return (
        <AddHealthContext.Provider value={addHealth}>
            <HealthColorContext.Provider value={healthColor}>
                <RelativeHealthContext.Provider value={healthProcent}>
                    {children}
                </RelativeHealthContext.Provider>
            </HealthColorContext.Provider>
        </AddHealthContext.Provider>
    )
}

export default HealthContextProvider
