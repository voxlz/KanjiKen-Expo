import React, { FC } from 'react'
import StatusBar from './StatusBar'
import HealthBar from './HealthBar'
import { useContext } from '../utils/react'
import { SeenCountContext } from '../contexts/ChallengeContextProvider'
import { View } from 'react-native'

type Props = { skillTitle: string; glyphWidth: number }

/** The upper bar for main exercise view */
const UpperBar: FC<Props> = ({ skillTitle, glyphWidth }) => {
    const seenCount = useContext(SeenCountContext)

    return (
        <View style={{ gap: 8 }} className=" flex-grow self-stretch  mb-8">
            <HealthBar glyphWidth={glyphWidth} />
            <StatusBar seenCount={seenCount} text={skillTitle} />
        </View>
    )
}

export default UpperBar
