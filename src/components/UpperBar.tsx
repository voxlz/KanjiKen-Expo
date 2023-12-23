import React, { FC } from 'react'
import StatusBar from './StatusBar'
import HealthBar, { ExitBtn } from './HealthBar'
import { useContext } from '../utils/react'
import { SeenCountContext } from '../contexts/ChallengeContextProvider'
import { View } from 'react-native'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import { QuitContext as SetQuitContext } from '../contexts/HealthContextProvider'

type Props = { skillTitle: string; glyphWidth: number }

/** The upper bar for main exercise view */
const UpperBar: FC<Props> = ({ skillTitle }) => {
    const seenCount = useContext(SeenCountContext)
    const glyphWidth = useContext(GlyphWidthContext)
    const quit = useContext(SetQuitContext)
    const height = glyphWidth / 3
    return (
        <View style={{ gap: 8 }} className="self-stretch mt-14 mb-8">
            <View style={{ gap: 12 }} className="flex-row px-8 items-center">
                <HealthBar />
                <ExitBtn
                    height={height}
                    onPress={() => {
                        quit(true)
                    }}
                ></ExitBtn>
            </View>
            <StatusBar seenCount={seenCount} text={skillTitle} />
        </View>
    )
}

export default UpperBar
