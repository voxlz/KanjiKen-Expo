import React, { FC, useEffect, useMemo } from 'react'
import { Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { learnOrder } from '../output/learnOrder'
import GlyphProgress from '../src/components/GlyphProgress'
import { ExitBtn } from '../src/components/HealthBar'
import TextView from '../src/components/TextView'
import { GlyphInfo } from '../src/contexts/ChallengeContextProvider'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'
import { glyphDict } from '../src/data/glyphDict'
import { Learnable } from '../src/types/progress'
import { useContext } from '../src/utils/react'

/** Forgot to write a component discription. */
const Discovery: FC = () => {
   const scheduler = useContext(SchedulerContext)
   const prog = scheduler.getProgress()
   const groupedGlyphs = useMemo(() => [] as GlyphInfo[][], [])
   useEffect(() => {
      const a = performance.now()
      const chunkSize = 20
      const glyphs: GlyphInfo[] = learnOrder.map(
         (glyph: Learnable) => glyphDict[glyph]
      )
      for (let i = 0; i < glyphs.length; i += chunkSize) {
         const chunk = glyphs.slice(i, i + chunkSize)
         if (prog[chunk[0].glyph]) groupedGlyphs.push(chunk)
      }
      console.log('took ', performance.now() - a)
   }, [groupedGlyphs, prog])

   return (
      <View className="mt-14">
         <FlatList
            initialNumToRender={3}
            ListEmptyComponent={
               <View className="px-8 py-4 mb-4  self-stretch">
                  <TextView
                     className="text-center text-gray-500 "
                     text="Loading..."
                  />
               </View>
            }
            ListFooterComponent={
               <View className="px-8 py-4 mb-4  self-stretch">
                  <TextView
                     className="text-center text-gray-500"
                     text="Practice more to unlock more characters "
                  />
               </View>
            }
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
                     className="m-4 p-4 rounded-lg mb-0 border-gray-200 "
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
                        className="flex-row max-w-fullflex-shrink flex-wrap h-auto "
                     >
                        {item.item.map((alt: GlyphInfo, i: number) => (
                           <GlyphProgress glyphInfo={alt} key={i} />
                        ))}
                     </View>
                  </View>
               )
            }}
         />
      </View>
   )
}

export default Discovery
