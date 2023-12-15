import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { router, useLocalSearchParams } from 'expo-router'
import { View, Text, Pressable } from 'react-native'
import InputText from '../../src/login_pytte/InputText'
import StyledButton from '../../src/components/StyledButton'

interface FormForgot {
    Email: string
}

const UserForgotView: FC<{}> = () => {
    const { control, setValue, setError, handleSubmit } = useForm<FormForgot>()
    const auth = getAuth()
    const [sentEmail, setSentEmail] = useState(false)
    const [loading, setLoading] = useState(false)
    const params = useLocalSearchParams()

    useEffect(() => {
        console.log('params', params)
        setValue('Email', params['email'] as string)
    }, [])

    const resetPassword = (email: string) => {
        if (!email || email.trim() === '')
            setError('Email', {
                message: 'Please input an email adress',
                type: 'vaildation',
            })
        else if (!RegExp(/^[^\s@]+@[^\s@]+$/).test(email.trim()))
            setError('Email', {
                message: 'Please enter a valid email adress',
                type: 'vaildation',
            })
        else if (!sentEmail) {
            console.log('valid mail')
            setLoading(true)
            sendPasswordResetEmail(auth, email).then(() => {
                setSentEmail(true)
                setLoading(false)
            })
        }
    }

    return (
        <>
            {!loading ? (
                <View>
                    <View>
                        <Text className="m-0 font-bold text-xl mb-4  text-center">
                            {!sentEmail
                                ? 'Reset Password'
                                : 'Success! Check your mail inbox.'}
                        </Text>
                        <View style={{ gap: 12 }} className="items-streach">
                            <InputText name="Email" control={control} />
                            <StyledButton
                                styleName={sentEmail ? 'normal' : 'forest'}
                                text={
                                    !sentEmail
                                        ? 'Send Reset Email'
                                        : 'Send Another Email?'
                                }
                                className={
                                    'px-3 h-12 rounded-xl w-full flex items-center justify-center text-white text-md font-bold focus:outline-none focus:ring-2 ' +
                                    (!sentEmail
                                        ? 'bg-forest-800 '
                                        : 'bg-weakColor')
                                }
                                onPress={handleSubmit((data) =>
                                    resetPassword(data.Email)
                                )}
                            />
                        </View>
                    </View>

                    <View
                        style={{ gap: 4 }}
                        className="flex-row justify-center mt-6"
                    >
                        <Text className="text-sm">Know the password?</Text>
                        <Pressable
                            className="focus:outline-none focus:ring-2"
                            onPress={() => router.push('/login')}
                        >
                            <Text className="text-sm font-bold text-forest-800 hover:underline">
                                Sign in here!
                            </Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View className="justify-center items-center">
                    <Text className="font-bold">Loading...</Text>
                </View>
            )}
        </>
    )
}

export default UserForgotView
