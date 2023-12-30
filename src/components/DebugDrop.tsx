import React, { FC, useState } from 'react'
import { View } from 'react-native'

import { drops, hoverPos as globalHoverPos } from '../globalState/DropInfo'
import { useInterval } from '../hooks/useInterval'
import { XY, DropInfo } from '../types/dropInfo'

/** Used to debug drop interactions */
const DebugDrop: FC = () => {
   const [hoverPos, setHoverPos] = useState<XY>({ x: 0, y: 0 })
   const [hoverInfos, setHoverInfos] = useState<DropInfo[]>(drops)
   useInterval(() => {
      console.log('aaa')
      setHoverPos(globalHoverPos ?? { x: 0, y: 0 })
      setHoverInfos(drops)
   }, 1000)
   return (
      <View
         style={{ elevation: -1, zIndex: -1 }}
         className="absolute w-full h-full"
      >
         <View
            style={{ elevation: -10, zIndex: -10 }}
            className="absolute w-full h-full bg-red-200"
         />
         <View
            style={{
               width: 10,
               height: 10,
               position: 'absolute',
               top: hoverPos?.y - 5,
               left: hoverPos?.x - 5,
               elevation: 100,
               zIndex: 100,
            }}
            className="bg-blue-400"
         />
         {hoverInfos.map((hoverInfo) => {
            return (
               <View
                  style={{
                     width: hoverInfo.width,
                     height: hoverInfo.height,
                     position: 'absolute',
                     top: hoverInfo.y,
                     left: hoverInfo.x,
                     elevation: 80,
                     zIndex: 80,
                  }}
                  className="bg-green-400 opacity-30"
               />
            )
         })}
      </View>
   )
}

export default DebugDrop
