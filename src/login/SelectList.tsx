import React, { FC } from 'react'
import { Pressable, View } from 'react-native'

interface Props {
   list: string[]
   selected: number
   onSelect: (str: string) => void
}

const SelectList: FC<Props> = ({ list, onSelect, selected }) => (
   <View className="absolute left-0 right-0 flex flex-col text-lg bg-white  dark:bg-black border border-lineColor rounded-lg top-0 overflow-auto max-h-96">
      {list.map((alt, i) => (
         <View key={i} className="">
            {i !== 0 && <hr />}
            <Pressable
               key={i}
               className={
                  'hover:bg-blue-200 hover:text-white p-3 rounded-lg pointer-events-auto text-left w-full self-stretch ' +
                  (selected === i ? ' bg-blue-200' : '')
               }
               onPointerDown={() => onSelect(alt)}
            >
               {/* <FuriganaText text={alt} /> */}
            </Pressable>
         </View>
      ))}
   </View>
)

export default SelectList
