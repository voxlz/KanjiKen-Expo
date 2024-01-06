/** Clamp a number to a certain range */
export function clamp(_: { min: number; value: number; max: number }) {
   return Math.max(_.min, Math.min(_.value, _.max))
}

/** Deep clone obj */
export const structuredClone = <T>(obj: T) => {
   return JSON.parse(JSON.stringify(obj)) as T
}

/** Find unique given some key function */
export const uniqueBy = <Input, Key>(a: Input[], getKey: (b: Input) => Key) => {
   const seen = new Set<Key>()
   return a.filter((item) => {
      const k = getKey(item)
      return seen.has(k) ? false : seen.add(k)
   })
}
