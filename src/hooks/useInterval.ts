import { useRef, useEffect } from 'react'

export function useInterval(callback: () => unknown, delay: number) {
   const savedCallback = useRef<() => unknown>()

   // Remember the latest callback.
   useEffect(() => {
      savedCallback.current = callback
   }, [callback])

   // Set up the interval.
   useEffect(() => {
      function tick() {
         savedCallback.current?.()
      }
      if (delay !== null) {
         const id = setInterval(tick, delay)
         return () => clearInterval(id)
      }
   }, [delay])
}
