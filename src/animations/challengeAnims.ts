import {
    useDerivedValue,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated'

export const useChallengeAnims = () => {
    const builderScale = useSharedValue(1)
    const kanjiScale = useSharedValue(0.5)
    const opacity = useSharedValue(1)
    const continueTranslateY = useSharedValue(200)
    const invertedOpacity = useDerivedValue(() => 1 - opacity.value)

    const springDefault = {
        stiffness: 236.9,
        damping: 20,
        mass: 1,
        restSpeedThreshold: 0.1,
    }
    const duration = 200
    const anim = (value: number) =>
        withDelay(duration, withSpring(value, springDefault))

    const stopAnimation = () => {
        builderScale.value = 1
        kanjiScale.value = 0.5
        opacity.value = 1
        continueTranslateY.value = 200
    }

    const animation = () => {
        console.log('Started animation')
        stopAnimation()

        builderScale.value = withTiming(1.2, { duration: duration })
        opacity.value = anim(0)
        builderScale.value = anim(0.5)
        kanjiScale.value = anim(1)
        continueTranslateY.value = anim(0)
    }

    const reset = () => {
        builderScale.value = 1 // Needs to be fast since we measure size here.
        kanjiScale.value = withSpring(0.5, springDefault)
        opacity.value = withSpring(1, springDefault)
        continueTranslateY.value = withSpring(200, springDefault)
    }

    return {
        animation,
        reset,
        builderScale,
        kanjiScale,
        opacity,
        continueTranslateY,
        invertedOpacity,
    }
}
