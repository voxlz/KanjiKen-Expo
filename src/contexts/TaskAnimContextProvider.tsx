import React, { FC, ReactNode } from 'react'
import { createContext as CC } from '../utils/react'
import {
    SharedValue,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated'

// Contexts
export const ContinueAnimContext = CC<SharedValue<number>>()
export const ContinueAnimInstantResetContext = CC<SharedValue<number>>()
export const StartFinishAnimationContext = CC<() => void>()
export const ResetFinishAnimationContext = CC<() => void>()

const TaskAnimContextProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const progress = useSharedValue(-1)
    const progressInstantReset = useSharedValue(-1)

    // const builderScale = useSharedValue(1)
    // const kanjiScale = useSharedValue(0.5)
    // const opacity = useSharedValue(1)
    // const continueTranslateY = useSharedValue(200)
    // const invertedOpacity = useDerivedValue(() => 1 - opacity.value)

    const springAnimation = {
        stiffness: 236.9,
        damping: 20,
        mass: 1,
        restSpeedThreshold: 0.1,
    }

    const windUp = 200

    const start = () => {
        console.log('Started animation')

        progress.value = -1
        progress.value = withSequence(
            withTiming(0, { duration: windUp }),
            withSpring(1, springAnimation)
        )

        progressInstantReset.value = -1
        progressInstantReset.value = withSequence(
            withTiming(0, { duration: windUp }),
            withSpring(1, springAnimation)
        )
    }

    const reset = () => {
        console.log('Reset animation')
        progress.value = 1
        progress.value = withSequence(
            withSpring(0, springAnimation),
            withTiming(-1, { duration: 0 })
        )

        progressInstantReset.value = -1
    }

    return (
        <ResetFinishAnimationContext.Provider value={reset}>
            <StartFinishAnimationContext.Provider value={start}>
                <ContinueAnimContext.Provider value={progress}>
                    <ContinueAnimInstantResetContext.Provider
                        value={progressInstantReset}
                    >
                        {children}
                    </ContinueAnimInstantResetContext.Provider>
                </ContinueAnimContext.Provider>
            </StartFinishAnimationContext.Provider>
        </ResetFinishAnimationContext.Provider>
    )
}
export default TaskAnimContextProvider
