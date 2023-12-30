import { FC } from 'react'
import { View, Text } from 'react-native'

export type Form = {
   name: string
   email: string
   password: string
}

export const BorderBox: FC<{
   className?: string
   error?: boolean
   children: React.ReactElement
}> = ({ children, error, className }) => (
   <View
      className={`border border-ui-bold px-3 rounded-xl h-12 items-center focus-within:ring-2  group-focus:ring-2  select-none bg-background dark:bg-black  ${className} ${
         error ? 'border-red-800 border-2 focus-within:ring-red-400' : ' '
      }`}
   >
      {children}
   </View>
)

export const BorderBoxBtn: FC<{
   className?: string
   children: React.ReactElement
}> = ({ children, className }) => (
   <View
      className={
         ' border border-ui-bol px-3 rounded-xl w-full flex h-12 items-center focus-within:ring-2  group-focus:ring-2  select-none bg-white dark:bg-black shadow-sm hover:bg-background ' +
         className
      }
   >
      {children}
   </View>
)

export const LineBreak: FC<{ text: string }> = ({ text }) => (
   <View className="h-5 my-10 mt-8 flex w-full flex-row">
      <View className="border-b flex-grow mb-1 w-1 border-lineColor" />
      <Text className="mx-2 font-bold text-xs text-weakColor self-end">
         {text}
      </Text>
      <View className="border-b flex-grow mb-1 border-lineColo" />
   </View>
)
