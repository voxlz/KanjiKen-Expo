import auth from '@react-native-firebase/auth'
import { router, useLocalSearchParams } from 'expo-router'
import React, { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { View, Pressable, Text } from 'react-native'

import StyledButton from '../../src/components/StyledButton'
import InputText from '../../src/login/InputText'
import { LineBreak } from '../../src/login/LoginHelperComponents'
import SignInProviders from '../../src/login/SignInProviders'

interface FormRegister {
   Username: string
   Email: string
   Password: string
}

const UserRegisterView: FC = () => {
   const { control, setError, getValues, handleSubmit, setValue } =
      useForm<FormRegister>()
   const params = useLocalSearchParams()

   useEffect(() => {
      setValue('Email', params['email'] as string)
      setValue('Password', params['password'] as string)
   }, [])

   const signUpWithEmail: SubmitHandler<FormRegister> = (data) => {
      console.log('register attempt', data)
      if (data['Username'] === undefined) {
         setError('Username', {
            message: 'Please enter a username',
            type: 'firebase',
         })
         return
      }
      if (data['Email'] === undefined) {
         setError('Email', {
            message: 'Please enter a email',
            type: 'firebase',
         })
         return
      }
      if (data['Password'] === undefined) {
         setError('Password', {
            message: 'Please enter a password',
            type: 'firebase',
         })
         return
      }
      auth()
         .createUserWithEmailAndPassword(data.Email, data.Password)
         .then((userCredential) => {
            console.log('Account created!')
            router.replace('/')
         })
         .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message

            if (error.code === 'auth/invalid-email')
               setError('Email', {
                  message: 'Please enter a valid email adress',
                  type: 'firebase',
               })
            else if (error.code === 'auth/missing-password')
               setError('Password', {
                  message: 'Please enter a password',
                  type: 'firebase',
               })
            else if (error.code === 'auth/weak-password')
               setError('Password', {
                  message: 'Password should be at least 6 characters',
                  type: 'firebase',
               })
            else {
               setError('Email', {
                  message: errorMessage,
                  type: 'unhandled',
               })
            }

            console.error('1 ' + errorCode + ' 2 ' + errorMessage)
         })
   }

   // const login = useCallback(
   //     (firebaseUser: User | null) => {
   //         if (firebaseUser === null)
   //             return console.error('acc had no user object')

   //         console.log('Get or create user data')

   //         socket.emit(
   //             'getOrCreateUserData',
   //             firebaseUser,
   //             (data: DataUser) => {
   //                 console.log('USER ACC', firebaseUser)
   //                 console.log('USER DATA', data)
   //                 setUser(data)
   //             }
   //         )
   //     },
   //     [setUser, socket]
   // )

   // // Remember email
   // useEffect(() => {
   //     setValue('email', (history.location.state as any)?.email ?? '')
   // }, [history.location.state, setValue])

   // useRedirectSignedInUser(auth)
   // useOAuthHandler(auth, login)

   return (
      <View>
         {/* Form needed for enter to submit */}
         <View style={{ gap: 12 }} className="items-stretch flex-grow">
            <Text className="m-0 text-xl font-bold text-center mb-6">
               Create new account
            </Text>
            <InputText name="Username" control={control} />
            <InputText name="Email" control={control} />
            <InputText name="Password" control={control} />
            <StyledButton
               text="Create Account"
               styleName="forest"
               className="text-md focus:outline-none flex h-11 w-full items-center justify-center rounded-xl bg-forest-800 px-3 font-bold text-white focus:ring-2"
               onPress={() => {
                  console.log('click')
                  handleSubmit(
                     (data) => {
                        console.log('submit', data)
                        signUpWithEmail(data)
                     },
                     (err) => {
                        console.log('errors', err)
                     }
                  )()
               }}
            />
         </View>

         <LineBreak text="OR" />

         <SignInProviders />

         <View style={{ gap: 4 }} className="flex-row mt-10 justify-center">
            <Text className="text-sm">Already have an account?</Text>
            <Pressable
               className="focus:outline-none focus:ring-2"
               onPress={() =>
                  router.replace({
                     pathname: '/auth/login',
                     params: {
                        email: getValues('Email'),
                        password: getValues('Password'),
                     },
                  })
               }
            >
               <Text className="text-sm font-bold text-forest-800 hover:underline">
                  Log in now!
               </Text>
            </Pressable>
         </View>
      </View>
   )
}

export default UserRegisterView

export function capitalize(field: string): string | undefined {
   return field.charAt(0).toUpperCase() + field.slice(1)
}
