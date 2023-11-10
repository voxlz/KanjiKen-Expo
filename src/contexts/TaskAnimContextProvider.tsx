import React, { FC, ReactNode } from 'react'
import { createContext as CC } from '../utils/react'
import {
    SharedValue,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated'

// Contexts
export const ProgressFinishAnimationContext = CC<SharedValue<number>>()
export const StartFinishAnimationContext = CC<() => void>()
export const ResetFinishAnimationContext = CC<() => void>()

const TaskAnimContextProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const progress = useSharedValue(-1)

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
    // const anim = (value: number) =>
    //     withDelay(duration, withSpring(value, springDefault))

    const stopAnimation = () => {
        // builderScale.value = 1
        // kanjiScale.value = 0.5
        // opacity.value = 1
        // continueTranslateY.value = 200
    }

    const start = () => {
        console.log('Started animation')
        // stopAnimation()

        progress.value = -1
        progress.value = withSequence(
            withTiming(0, { duration: windUp }),
            withSpring(1, springAnimation)
        )
        // opacity.value = anim(0)
        // builderScale.value = anim(0.5)
        // kanjiScale.value = anim(1)
        // continueTranslateY.value = anim(0)
    }

    const reset = () => {

        // builderScale.value = 1 // Needs to be fast since we measure size here.
        // kanjiScale.value = withSpring(0.5, springAnimation)
        // opacity.value = withSpring(1, springAnimation)
        // continueTranslateY.value = withSpring(200, springAnimation)
    }

    return (
        <ResetFinishAnimationContext.Provider value={reset}>
            <StartFinishAnimationContext.Provider value={start}>
                <ProgressFinishAnimationContext.Provider value={progress}>
                    {children}
                </ProgressFinishAnimationContext.Provider>
            </StartFinishAnimationContext.Provider>
        </ResetFinishAnimationContext.Provider>
    )
}
export default TaskAnimContextProvider
