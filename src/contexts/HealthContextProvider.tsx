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

export const RelativeHealthContext = createContext<SharedValue<number>>()
export const HealthColorContext = createContext<SharedValue<number>>()
export const AddHealthContext = createContext<(health: number) => void>()

enum HealthColor {
    Damage = 0,
    Normal = 1,
    Health = 2,
}

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
        healthProcent.value = withTiming(((health + diff) / maxHealth) * 100)

        // You took damage
        if (diff < 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            healthColor.value = 0
            healthColor.value = withDelay(
                300,
                withSpring(1, {
                    duration: 500,
                })
            )
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
