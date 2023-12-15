import {
    createUserWithEmailAndPassword,
    getAuth,
    updateProfile,
    User,
} from 'firebase/auth'
import React, { useCallback, useContext, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { FC } from 'react-router/node_modules/@types/react'
import InputText from '../components/common/InputText'
import {
    BorderBoxBtn,
    Form,
    LineBreak,
} from '../components/LoginHelperComponents'
import UserContext from '../contexts/UserContext'
import {
    useOAuthHandler,
    useRedirectSignedInUser,
} from '../hooks/useLoginRedirect'
import { signInWithGoogle, signInWithTwitter } from '../logic/LoginLogic'
import { UserData as DataUser } from '../shared/schemaTypes'
import { ReactComponent as GoogleLogo } from '../svg/logos/google.svg'
import { ReactComponent as TwitterLogo } from '../svg/logos/twitter.svg'

const UserRegisterView: FC = () => {
    const { socket, setUser, fireApp } = useContext(UserContext)
    const {
        register,
        handleSubmit,
        getValues,
        setError,
        setValue,
        formState: { errors },
    } = useForm<Form>()
    const history = useHistory()
    const auth = getAuth(fireApp)

    const signUpWithEmail: SubmitHandler<Form> = (data) => {
        console.log('register attempt')
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user
                updateProfile(user, { displayName: getValues('name') }) // Probably does not need to be sync
                login(user)
                history.push('/')
            })
            .catch((error) => {
                var errorCode = error.code
                var errorMessage = error.message

                if (error.code === 'auth/invalid-email')
                    setError('email', {
                        message: 'Please enter a valid email adress',
                        type: 'firebase',
                    })
                else {
                    setError('email', {
                        message: errorMessage,
                        type: 'unhandled',
                    })
                }

                console.error('1 ' + errorCode + ' 2 ' + errorMessage)
            })
    }
    const login = useCallback(
        (firebaseUser: User | null) => {
            if (firebaseUser === null)
                return console.error('acc had no user object')

            console.log('Get or create user data')

            socket.emit(
                'getOrCreateUserData',
                firebaseUser,
                (data: DataUser) => {
                    console.log('USER ACC', firebaseUser)
                    console.log('USER DATA', data)
                    setUser(data)
                }
            )
        },
        [setUser, socket]
    )

    // Remember email
    useEffect(() => {
        setValue('email', (history.location.state as any)?.email ?? '')
    }, [history.location.state, setValue])

    useRedirectSignedInUser(auth)
    useOAuthHandler(auth, login)

    return (
        <div className="min-w-sm m-auto w-[400px] max-w-[90%] px-6">
            {/* Form needed for enter to submit */}
            <form
                onSubmit={handleSubmit(signUpWithEmail)}
                className="flex w-full flex-col items-center justify-center  space-y-4"
            >
                <h2 className=" m-0 mb-4 text-xl font-bold">
                    Create new account
                </h2>
                <InputText field="name" register={register} errors={errors} />
                <InputText field="email" register={register} errors={errors} />
                <InputText
                    field="password"
                    register={register}
                    errors={errors}
                />

                <input
                    type="submit"
                    value="Sign up"
                    className="text-md focus:outline-none flex h-11 w-full items-center justify-center rounded-xl bg-primaryColor px-3 font-bold text-white focus:ring-2"
                />
            </form>

            <LineBreak text="OR" />

            <h3 className="m-0 mb-3 mt-4 text-center text-sm font-semibold ">
                Sign up with
            </h3>
            <div className="flex w-full gap-4">
                <button
                    className="group focus:outline-none flex-grow"
                    onPointerDown={() => signInWithGoogle(auth)}
                >
                    <BorderBoxBtn className="justify-center">
                        <GoogleLogo className="-ml-4" />
                        <p>Google</p>
                    </BorderBoxBtn>
                </button>
                <button
                    className="group focus:outline-none flex-grow"
                    onPointerDown={() => signInWithTwitter(auth)}
                >
                    <BorderBoxBtn className="justify-center">
                        <TwitterLogo className="-ml-4" />
                        <p>Twitter</p>
                    </BorderBoxBtn>
                </button>
            </div>

            <div className="mt-12 flex justify-center gap-1">
                <p className="text-sm">Already have an account?</p>
                <button
                    className="focus:outline-none focus:ring-2"
                    onPointerDown={() =>
                        history.push({
                            pathname: '/login',
                            state: { email: getValues('email') },
                        })
                    }
                >
                    <p className=" text-sm text-primaryColor hover:underline">
                        Log in now!
                    </p>
                </button>
            </div>
        </div>
    )
}

export default UserRegisterView

export function capitalize(field: string): string | undefined {
    return field.charAt(0).toUpperCase() + field.slice(1)
}
