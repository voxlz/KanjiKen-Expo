import React, { FC } from 'react'
import { Text, View } from 'react-native'
import { useContext } from '../src/utils/react'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'
import { glyphDict } from '../src/data/glyphDict'
import { Learnable } from '../src/types/progress'
import { FlatList } from 'react-native-gesture-handler'
import { GlyphWidthContext } from '../src/contexts/GlyphWidthContextProvider'
import Svg, { Circle, ClipPath, Path, Rect } from 'react-native-svg'
import Button from '../src/components/Button'
import { GlyphInfo } from '../src/contexts/ChallengeContextProvider'
import { ExitBtn } from '../src/components/HealthBar'
import { learnOrder } from '../src/data/learnOrder'

type Props = {}

/** Forgot to write a component discription. */
const Dictionary: FC<Props> = ({}) => {
    const scheduler = useContext(SchedulerContext)
    const prog = scheduler.getProgress()
    const glyphs = learnOrder.map((glyph) => glyphDict[glyph as Learnable])
    const groupedGlyphs = []
    const chunkSize = 20
    for (let i = 0; i < glyphs.length; i += chunkSize) {
        const chunk = glyphs.slice(i, i + chunkSize)
        if (prog[chunk[0].glyph]) groupedGlyphs.push(chunk)
    }
    const glyphWidth = useContext(GlyphWidthContext)
    // <CharacterGrid chars={glyphs} />
    const width = (glyphWidth * 15.5) / 20
    const radius = width

    return (
        <View className="mt-14">
            <FlatList
                data={groupedGlyphs}
                ListHeaderComponent={
                    <View className="flex-row justify-between px-4 bg-[#ffffff79]">
                        <Text className="text-xl font-bold">Discovered</Text>
                        <ExitBtn height={20} />
                    </View>
                }
                stickyHeaderIndices={[0]}
                renderItem={(item) => {
                    return (
                        <View
                            className="m-4 p-4 rounded-lg mb-0 border-gray-200"
                            style={{ borderStyle: 'solid', borderWidth: 2 }}
                        >
                            <View className="justify-between flex-row mb-4">
                                <Text className="text-lg font-bold">
                                    Group {item.index + 1}
                                </Text>
                                {/* <Text>1 | 5 | 20</Text> */}
                            </View>
                            <View
                                style={{ gap: 10 }}
                                className="flex-row max-w-fullflex-shrink flex-wrap h-auto"
                            >
                                {item.item.map((alt: GlyphInfo, i: number) => {
                                    let lvl =
                                        (prog[alt.glyph]?.skills.recognize ??
                                            0) +
                                        (prog[alt.glyph]?.skills.compose ?? 0)
                                    let degrees: number
                                    let state: 'new' | 'learned' | 'maxed'
                                    if (lvl < 5) {
                                        degrees = (lvl / 5) * 360
                                        state = 'new'
                                    } else if (lvl < 10) {
                                        degrees = ((lvl - 5) / 5) * 360
                                        state = 'learned'
                                    } else {
                                        degrees = 0
                                        state = 'maxed'
                                    }

                                    const angle = (degrees * Math.PI) / 180
                                    const x =
                                        ((Math.fround(Math.sin(angle)) + 1) /
                                            2) *
                                        width *
                                        2
                                    const y =
                                        ((Math.fround(Math.cos(angle) * -1) +
                                            1) /
                                            2) *
                                        width *
                                        2
                                    // console.log('x:', x, 'y:', y)
                                    return (
                                        <View className="relative" key={i}>
                                            <View
                                                style={{
                                                    width: width,
                                                    height: width,
                                                }}
                                            >
                                                <Button
                                                    text={alt.glyph}
                                                    lang="jap"
                                                    styleName="choices"
                                                    btnClass={
                                                        'bg-transparent ' +
                                                        (state === 'new'
                                                            ? 'border-[#666666]'
                                                            : state ===
                                                              'learned'
                                                            ? 'border-[#326A00]'
                                                            : 'border-[#B58D00]')
                                                    }
                                                    textStyle={{
                                                        fontSize: 34,
                                                        lineHeight: 38,
                                                    }}
                                                />
                                            </View>
                                            <Svg
                                                className="bg-transparent absolute -z-10"
                                                style={{
                                                    width: width * 2,
                                                    height: width * 2,
                                                    margin: -width / 2,
                                                }}
                                                clipPath="#roundedRect"
                                            >
                                                <ClipPath id="roundedRect">
                                                    <Rect
                                                        x={width / 2 + 1}
                                                        y={width / 2 + 1}
                                                        width={width - 2}
                                                        height={width - 2}
                                                        rx="13"
                                                        ry="13"
                                                    />
                                                </ClipPath>
                                                {/* Background  */}
                                                <Circle
                                                    fill={
                                                        state === 'new'
                                                            ? '#ECEAEA'
                                                            : state ===
                                                              'learned'
                                                            ? '#9DE55F'
                                                            : '#FFD600'
                                                    }
                                                    cx={width}
                                                    cy={width}
                                                    r={width}
                                                    clipPath="#roundedRect"
                                                />
                                                {/* Filled in part */}
                                                <Path
                                                    fill={
                                                        state === 'new'
                                                            ? '#9DE55F'
                                                            : state ===
                                                              'learned'
                                                            ? '#65D800'
                                                            : undefined
                                                    }
                                                    d={`
                                                    M ${width} ${width} 
                                                    L ${width} 0 
                                                    A ${radius} ${radius} 0 
                                                    ${
                                                        degrees >= 180 ? 1 : 0
                                                    } 1 ${x} ${y}
                                                    `}
                                                    clipPath="#roundedRect"
                                                />
                                            </Svg>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default Dictionary
