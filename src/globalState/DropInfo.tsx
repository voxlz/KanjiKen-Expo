import { dropInfoEqual } from '../reducers/dropsReducer'
import { DropInfo, XY } from '../types/dropInfo'

// This class is a bit special. To avoid rerendering during drag animations i need to be able to read and update droplocations globally.
// The following few statements do exactly that

export let hoverRef: DropInfo | undefined // access but won't trigger rerender on change
export let hoverPos: XY | undefined

export let drops: DropInfo[] = [] // Global drops list

export const findDrop = (glyph?: string) =>
   drops.find((info) => info.glyph === glyph)

export const clearDrops = () => (drops = [])

/** Create or Update drop location. */
export const updateDrops = (newInfo: DropInfo) => {
   const idx = drops.findIndex((oldInfo) => dropInfoEqual(newInfo, oldInfo))
   drops =
      idx !== -1
         ? drops.map((oldInfo, i) => (i === idx ? newInfo : oldInfo))
         : [...drops, newInfo]
}

export const updateHoverRef = (loc?: XY) => {
   hoverPos = loc
   const newHover = drops.find(
      (drop) =>
         loc &&
         loc.x >= drop.dropHitbox.x &&
         loc.x <= drop.dropHitbox.x + drop.dropHitbox.width &&
         loc.y >= drop.dropHitbox.y &&
         loc.y <= drop.dropHitbox.y + drop.dropHitbox.height
   )
   if (!dropInfoEqual(newHover, hoverRef)) {
      hoverRef = newHover
   }
}
