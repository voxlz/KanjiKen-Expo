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
      // console.log('Update debug visual')
      setHoverPos(globalHoverPos ?? { x: 0, y: 0 })
      setHoverInfos(drops)
   }, 500)
   return (
      <View
         style={{
            elevation: 1,
            zIndex: 1,
            opacity: 0.5,
            pointerEvents: 'none',
         }}
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
                     width: hoverInfo.dropHitbox.width,
                     height: hoverInfo.dropHitbox.height,
                     position: 'absolute',
                     top: hoverInfo.dropHitbox.y,
                     left: hoverInfo.dropHitbox.x,
                     elevation: 80,
                     zIndex: 80,
                     borderColor: 'rgb(20 83 45)',
                     borderWidth: 1,
                  }}
                  className="bg-green-400 opacity-30"
               />
            )
         })}
         {hoverInfos.map((hoverInfo) => {
            return (
               <View
                  style={{
                     width: hoverInfo.dropActual.width,
                     height: hoverInfo.dropActual.height,
                     position: 'absolute',
                     top: hoverInfo.dropActual.y,
                     left: hoverInfo.dropActual.x,
                     elevation: 80,
                     zIndex: 80,
                     borderColor: 'rgb(20 100 45)',
                     borderWidth: 1,
                  }}
                  className="bg-green-400 opacity-30"
               />
            )
         })}
      </View>
   )
}

export default DebugDrop
