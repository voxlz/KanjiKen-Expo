import React, { FC } from 'react'
import { Text, View } from 'react-native'
import { useContext } from '../src/utils/react'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'
import CharacterGrid from '../src/components/CharacterGrid'
import { glyphDict } from '../src/data/glyphDict'
import { Learnable } from '../src/types/progress'
import { FlatList } from 'react-native-gesture-handler'
import Button from '../src/components/Button'
import { GlyphWidthContext } from '../src/contexts/GlyphWidthContextProvider'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

/** Forgot to write a component discription. */
const Dictionary: FC<Props> = ({}) => {
    const scheduler = useContext(SchedulerContext)
    const prog = scheduler.getProgress()
    const glyphs = Object.keys(prog).map(
        (glyph) => glyphDict[glyph as Learnable]
    )
    const groupedGlyphs = []
    const chunkSize = 20
    for (let i = 0; i < glyphs.length; i += chunkSize) {
        const chunk = glyphs.slice(i, i + chunkSize)
        groupedGlyphs.push(chunk) // do whatever
    }
    const glyphWidth = useContext(GlyphWidthContext)
    // <CharacterGrid chars={glyphs} />
    return (
        <View className="mt-14">
            <Text>Discovered</Text>
            <FlatList
                data={groupedGlyphs}
                // numColumns={5}
                // className=""
                // contentContainerStyle={{ alignItems: 'center', gap: 8 }}
                // columnWrapperStyle={{ gap: 8 }}
                renderItem={(item) => (
                    <View
                        className="m-4 p-4  mb-0 rounded-lg border-gray-200"
                        style={{ borderStyle: 'solid', borderWidth: 2 }}
                    >
                        <View className="justify-between flex-row mb-4">
                            <Text>Forest - Camp</Text>
                            <Text>1 | 5 | 20</Text>
                        </View>
                        <CharacterGrid chars={item.item} />
                    </View>
                )}
            />
        </View>
    )
}

export default Dictionary
