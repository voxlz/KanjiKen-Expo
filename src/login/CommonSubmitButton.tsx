import React, { FC } from 'react'
import { Pressable, Text } from 'react-native'

export const CommonSubmitButton: FC<{
   value: string
   className?: string
   onPress?: () => void
   disabled?: boolean
   danger?: boolean
}> = ({ value, className, onPress, danger, disabled }) => {
   return (
      <Pressable
         // type={!onPress ? "submit" : "button"}
         disabled={disabled}
         className={
            ` px-3 rounded-xl w-full flex h-11 items-center justify-center text-white text-md font-bold focus:outline-none focus:ring-2 dark:bg-black cursor-pointer hover:darker shadow-sm ` +
            className +
            (danger
               ? ` bg-red-500 `
               : disabled
                 ? ' bg-lineColor hover:bg-lineColor'
                 : ' bg-forest-800 hover:bg-primaryDarker ')
         }
         onPointerDown={() => {
            if (!disabled) onPress?.()
         }}
      >
         <Text> {value}</Text>
      </Pressable>
   )
}
