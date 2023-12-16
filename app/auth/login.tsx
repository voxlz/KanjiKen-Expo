import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { SubmitHandler, useForm } from 'react-hook-form'
// import '../old/modules/Login/Login.scss'
// import { UserData as DataUser } from '../shared/schemaTypes'
// import UserContext from '../contexts/UserContext'
// import { signInWithGoogle, signInWithTwitter } from '../logic/LoginLogic'
import GoogleLogo from '../../assets/logos/google.svg'
import TwitterLogo from '../../assets/logos/twitter.svg'
// import { useContext } from '../../src/utils/react'
// import UserContext from '../../src/login_pytte/UserContext'
import { router, useLocalSearchParams } from 'expo-router'
import React, { FC, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import InputText from '../../src/login_pytte/InputText'
import {
    LineBreak,
    BorderBoxBtn,
} from '../../src/login_pytte/LoginHelperComponents'
import {
    signInWithGoogle,
    signInWithTwitter,
} from '../../src/login_pytte/LoginLogic'
import StyledButton from '../../src/components/StyledButton'
// import { CommonSubmitButton } from '../components/common/CommonSubmitButton'
// import { LineBreak } from '../components/common/LineBreak'
// import InputText from '../components/common/InputText'
// import { BorderBox, BorderBoxBtn } from '../components/LoginHelperComponents'

interface Form {
    Email: string
    Password: string
}

const UserLoginView: FC = () => {
    // const { socket, setUser, fireApp } = useContext(UserContext)
    const auth = getAuth()
    const { getValues, setError, control, handleSubmit, setValue } =
        useForm<Form>()
    const params = useLocalSearchParams()

    const signInWithEmail: SubmitHandler<Form> = (data) => {
        console.log('login attempt', data)
        signInWithEmailAndPassword(auth, data.Email, data.Password)
            .then(() => {
                console.log('login attempt')
                router.replace('/')
                // const user = userCredential.user
                // login(user)
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

    // const login = useCallback(
    //     (firebaseUser: User | null) => {
    //         if (firebaseUser === null)
    //             return console.error('acc had no user object')

    //         // console.log('Get or create user data')

    //         // socket.emit(
    //         //     'getOrCreateUserData',
    //         //     firebaseUser,
    //         //     (data: DataUser) => {
    //         //         console.log('USER ACC', firebaseUser)
    //         //         console.log('USER DATA', data)
    //         //         setUser(data)
    //         //         router.replace('/index')
    //         //     }
    //         // )
    //     },
    //     [history, setUser, socket]
    // )

    useEffect(() => {
        setValue('Email', params['email'] as string)
        setValue('Password', params['password'] as string)
    }, [])

    // useRedirectSignedInUser(auth)
    // useOAuthHandler(auth, login)

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

            {false && (
                <>
                    <Text className="m-0 text-sm font-semibold text-center mb-3 mt-4 ">
                        Sign in with
                    </Text>
                    <View className="flex-row gap-4 w-full">
                        <Pressable
                            className="flex-grow group focus:outline-none "
                            onPress={() => signInWithGoogle(auth)}
                        >
                            <BorderBoxBtn className="justify-center ">
                                <View className="flex-row justify-between items-center ">
                                    <GoogleLogo className="-ml-4" />
                                    <Text>Google</Text>
                                </View>
                            </BorderBoxBtn>
                        </Pressable>
                        <Pressable
                            className="flex-grow group focus:outline-none"
                            onPress={() => signInWithTwitter(auth)}
                        >
                            <BorderBoxBtn className="justify-center">
                                <View className=" flex-row  items-center">
                                    <TwitterLogo className="-ml-4" />
                                    <Text>Twitter</Text>
                                </View>
                            </BorderBoxBtn>
                        </Pressable>
                    </View>
                </>
            )}

            <View style={{ gap: 4 }} className="flex-row justify-center mt-6">
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
