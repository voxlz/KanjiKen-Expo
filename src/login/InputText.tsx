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
   // const error = errors[field as Path<Form>]
   // const [showAutocomplete, setShowAutocomplete] = useState(false)
   // const [selectIndex, setSelectIndex] = useState(predictions ? 0 : -1)

   // const handleInput = (e: React.KeyboardEvent<HTMLInputElement>): void => {
   //     if (e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
   //         if (
   //             predictions &&
   //             predictions.length !== 0 &&
   //             showAutocomplete &&
   //             selectIndex < predictions.length &&
   //             selectIndex >= -1
   //         ) {
   //             const minus = Math.max(selectIndex - 1, -1)
   //             if (e.shiftKey || e.key === 'ArrowUp') {
   //                 if (minus !== -1) {
   //                     setSelectIndex(minus)
   //                     e.preventDefault()
   //                 } else {
   //                     setShowAutocomplete(false)
   //                     setSelectIndex(-1)
   //                 }
   //             } else {
   //                 if (selectIndex + 1 !== predictions.length) {
   //                     setSelectIndex(selectIndex + 1)
   //                     e.preventDefault()
   //                 } else {
   //                     setSelectIndex(-1)
   //                 }
   //             }
   //         } else {
   //             setShowAutocomplete(false)
   //             setSelectIndex(-1)
   //         }
   //     } else if (e.key === 'Enter') {
   //         if (selectIndex !== -1) {
   //             console.log(
   //                 'selectIndex',
   //                 selectIndex,
   //                 field,
   //                 predictions?.[selectIndex] ?? ''
   //             )
   //             e.preventDefault()

   //             // Only set value if there is prediction, don't clear field.
   //             if (predictions?.[selectIndex])
   //                 setValue?.(field, predictions[selectIndex] as any)

   //             setShowAutocomplete(false)
   //             setSelectIndex(-1)
   //         }
   //     } else if (e.key === 'Escape') {
   //         e.preventDefault()
   //         setShowAutocomplete(false)
   //         setSelectIndex(-1)
   //     }
   // }
   /** messes up pressing enter atm */
   // useEffect(() => {
   //   if (predictions) {
   //     console.log("set select index if predictions change", predictions)
   //     setSelectIndex(0)
   //   }
   // }, [predictions])

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
                     {/* {errors && errors[name]?.type === 'validate' && (
                                <Text className="mt-2 text-sm font-bold text-red-800">
                                    Not a number
                                </Text>
                            )} */}
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
