import React, { FC, useEffect, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import HealthBar from '../components/HealthBar'
import StatusBar from '../components/StatusBar'
import BottomBar from '../components/BottomBar'
import {
    SetChallengeContext,
    SeenCountContext,
} from '../contexts/ChallengeContextProvider'
import Animated from 'react-native-reanimated'
import Compose from './Compose'
import { learnOrder } from '../data/learnOrder'
import { GetGlyphContext } from '../contexts/ChallengeContextProvider'
import NewGlyph from './NewGlyph'
import { useContext } from '../utils/react'
import Recognize from './Recognize'

/** The general challenge view for building a kanji through components */
const Session: FC<{}> = ({}) => {
    const { width: windowWidth } = useWindowDimensions()

    // Context
    const setChallenge = useContext(SetChallengeContext)
    const seenCount = useContext(SeenCountContext)
    const getGlyph = useContext(GetGlyphContext)

    const [progressIdx, setProgressIdx] = useState(0)

    useEffect(() => {
        setChallenge?.(learnOrder[progressIdx])
    }, [])

    const margin = 36 * 2
    const gap = 3 * 12
    const glyphWidth = (windowWidth - margin - gap) / 4
    getGlyph?.()?.comps.position
    return (
        <Animated.View className="items-center pt-20 w-full h-full flex-grow ">
            <HealthBar glyphWidth={glyphWidth} />
            <StatusBar
                seenCount={seenCount}
                text={
                    getGlyph?.()?.comps.position ? 'Build Kanji' : 'New Kanji'
                }
            />
            <View className="flex-grow flex-shrink items-center">
                {getGlyph?.()?.comps.position ? (
                    <Compose glyphWidth={glyphWidth} />
                ) : (
                    <Recognize glyphWidth={glyphWidth} />
                    // <NewGlyph
                    //     glyphWidth={glyphWidth}
                    //     onContinue={() => {
                    //         const newIdx = progressIdx + 1
                    //         setChallenge?.(learnOrder[newIdx])
                    //         setProgressIdx(newIdx)
                    //     }}
                    // />
                )}
            </View>
            <BottomBar
                onContinue={() => {
                    const newIdx = progressIdx + 1
                    setChallenge?.(learnOrder[newIdx])
                    setProgressIdx(newIdx)
                }}
                glyphWidth={glyphWidth}
            />
        </Animated.View>
    )
}

export default Session
