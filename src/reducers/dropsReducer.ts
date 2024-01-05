// Keep track of drop locations

import { DropInfo } from '../types/dropInfo'

/** Are these two dropLocations the same? Looks at position and expected glyph. Used for updating dropInfo */
export const dropInfoEqual = (newInfo?: DropInfo, oldInfo?: DropInfo) => {
   if (newInfo && oldInfo)
      return (
         newInfo.glyph === oldInfo.glyph &&
         newInfo.dropActual.x === oldInfo.dropActual.x &&
         newInfo.dropActual.y === oldInfo.dropActual.y
      )
   return false
}

export const dropsReducer = (
   dropInfoArr: DropInfo[],
   action: { type: 'changed' | 'clear'; dropInfo?: DropInfo }
) => {
   switch (action.type) {
      case 'changed': {
         const newInfo = action.dropInfo
         if (!newInfo) {
            console.warn('changed called without value')
            return dropInfoArr
         }
         const idx = dropInfoArr.findIndex((oldInfo) =>
            dropInfoEqual(newInfo, oldInfo)
         )
         const value =
            idx !== -1
               ? dropInfoArr.map((oldInfo, i) =>
                    i === idx ? newInfo : oldInfo
                 )
               : [...dropInfoArr, newInfo]
         return value
      }
      case 'clear': {
         return []
      }
   }
}
