import { SubmitHandler, useForm } from 'react-hook-form'
import { router, useLocalSearchParams } from 'expo-router'
import React, { FC, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import InputText from '../../src/login_pytte/InputText'
import { LineBreak } from '../../src/login_pytte/LoginHelperComponents'
import StyledButton from '../../src/components/StyledButton'
import auth from '@react-native-firebase/auth'
import SignInProviders from '../../src/login_pytte/SignInProviders'

interface Form {
    Email: string
    Password: string
}

const UserLoginView: FC = () => {
    // const { socket, setUser, fireApp } = useContext(UserContext)
    const { getValues, setError, control, handleSubmit, setValue } =
        useForm<Form>()
    const params = useLocalSearchParams()

    const signInWithEmail: SubmitHandler<Form> = (data) => {
        console.log('login attempt', data)
        auth()
            .signInWithEmailAndPassword(data.Email, data.Password)
            .then(() => {
                console.log('login attempt')
                router.replace('/')
            })
            .catch((error) => {
                var errorCode = error.code
                var errorMessage = error.message

                if (error.code === 'auth/invalid-email')
                    setError('Email', {
                        message: 'Please enter a valid email adress',
                        type: 'firebase',
                    })
                else if (error.code === 'auth/missing-email')
                    setError('Email', {
                        message: 'Please input an email adress',
                        type: 'firebase',
                    })
                else if (error.code === 'auth/wrong-password')
                    setError('Password', {
                        message: 'Check your password',
                        type: 'firebase',
                    })
                else if (error.code === 'auth/invalid-credential')
                    setError('Password', {
                        message: 'No such account exists',
                        type: 'firebase',
                    })
                else if (error.code === 'auth/user-not-found')
                    setError('Email', {
                        message: 'No account with that email registered',
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

    useEffect(() => {
        setValue('Email', params['email'] as string)
        setValue('Password', params['password'] as string)
    }, [])

    return (
        <View>
            <View className="items-left w-full space-y-4" style={{ gap: 12 }}>
                <Text className="m-3 font-bold text-xl self-center">
                    Sign in
                </Text>
                <InputText control={control} name={'Email'} />
                <InputText
                    control={control}
                    name={'Password'}
                    btnText="Forgot?"
                    btnPress={() =>
                        router.push({
                            pathname: '/auth/forgot',
                            params: { email: getValues('Email') },
                        })
                    }
                />
                <StyledButton
                    text="Log in"
                    onPress={handleSubmit((data, err) => {
                        console.log('attempt login')
                        signInWithEmail(data)
                    })}
                />
            </View>

            <LineBreak text="OR" />

            <SignInProviders />

            <View style={{ gap: 4 }} className="flex-row justify-center mt-10">
                <Text className="text-sm">No account yet?</Text>
                <Pressable
                    className="focus:outline-none focus:ring-2"
                    onPress={() =>
                        router.replace({
                            pathname: '/auth/register',
                            params: {
                                email: getValues('Email'),
                                password: getValues('Password'),
                            },
                        })
                    }
                >
                    <Text className=" text-sm font-bold text-forest-800 hover:underline">
                        Sign up now!
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

export default UserLoginView
