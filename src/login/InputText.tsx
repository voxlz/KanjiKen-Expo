import React from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { View, Text, TextInput, Pressable } from 'react-native'

import { BorderBox } from './LoginHelperComponents'

interface Props<Form extends FieldValues> {
   // register: UseFormRegister<Form>
   // setValue?: UseFormSetValue<Form>
   // errors: FieldErrors<Form>
   // field: Path<Form>
   // label?: string
   // number?: boolean
   // subject?: string
   // onBlur?: () => void
   // className?: string
   // predictions?: string[]
   // focus?: () => void
   name: Path<Form>
   control: Control<Form, any>
   btnText?: string
   btnPress?: () => void
}

// // Redeclare forwardRef to fix typing issue
// declare module 'react' {
//     function forwardRef<T, P = {}>(
//         render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
//     ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
// }

const InputText = <Form extends FieldValues>({
   name,
   control,
   btnText,
   btnPress,
}: Props<Form>) => {
   return (
      <View className="flex-grow flex-col ">
         <Controller
            control={control}
            name={name}
            render={({
               field: { onChange, value, onBlur, ref, name },
               fieldState: { error },
            }) => {
               return (
                  <View>
                     <BorderBox
                        error={!!error}
                        className="group flex-grow select-none "
                     >
                        <View className="flex-row justify-center flex-grow">
                           <TextInput
                              ref={ref}
                              id={name}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                              className="flex-grow  mr-2 mb-1 focus:outline-none bg-background text-base self-stretch "
                              placeholder={name}
                              keyboardType={
                                 name === 'Email' ? 'email-address' : 'default'
                              }
                              secureTextEntry={name === 'Password'}
                           />
                           {btnText && (
                              <Pressable
                                 className="focus:outline-none focus:ring-2 justify-center self-stretch "
                                 onPress={btnPress}
                              >
                                 <Text className="font-bold text-base h-auto align-middle text-forest-800 hover:underline">
                                    {btnText}
                                 </Text>
                              </Pressable>
                           )}
                        </View>
                     </BorderBox>
                     {error && error?.type !== 'validate' && (
                        <Text className="mt-2 text-sm font-bold text-red-800">
                           {'' + error?.message}
                        </Text>
                     )}
                  </View>
               )
            }}
         />
         {/* {predictions && predictions.length !== 0 && showAutocomplete && (
                <View className="relative z-20 ">
                    <SelectList
                        list={predictions}
                        selected={selectIndex}
                        onSelect={(selected) =>
                            setValue?.(field, selected as any)
                        }
                    />
                </View>
            )} */}
      </View>
   )
}

export default InputText
