import { getAuth, signInWithEmailAndPassword, User } from 'firebase/auth'
import { SubmitHandler, useForm, useHistory } from 'react-hook-form'
import '../old/modules/Login/Login.scss'
// import { UserData as DataUser } from '../shared/schemaTypes'
// import UserContext from '../contexts/UserContext'
import {
    useOAuthHandler,
    useRedirectSignedInUser,
} from '../../src/login_pytte/useLoginRedirect'
// import { signInWithGoogle, signInWithTwitter } from '../logic/LoginLogic'
import GoogleLogo from '../../assets/logos/google.svg'
import TwitterLogo from '../../assets/logos/twitter.svg'
import { useContext } from '../../src/utils/react'
import UserContext from '../../src/login_pytte/UserContext'
// import { CommonSubmitButton } from '../components/common/CommonSubmitButton'
// import { LineBreak } from '../components/common/LineBreak'
// import InputText from '../components/common/InputText'
// import { BorderBox, BorderBoxBtn } from '../components/LoginHelperComponents'

type Form = {
    email: string
    pass: string
}

const UserLoginView = () => {
    const { socket, setUser, fireApp } = useContext(UserContext)
    const history = useHistory()
    const auth = getAuth(fireApp)
    const {
        register,
        handleSubmit,
        getValues,
        setError,
        setValue,
        formState: { errors },
    } = useForm<Form>()

    const signInWithEmail: SubmitHandler<Form> = (data) => {
        console.log('login attempt', data)
        signInWithEmailAndPassword(auth, data.email, data.pass)
            .then((userCredential) => {
                console.log('login attempt')
                const user = userCredential.user
                login(user)
            })
            .catch((error) => {
                var errorCode = error.code
                var errorMessage = error.message

                if (error.code === 'auth/invalid-email')
                    setError('email', {
                        message: 'Please enter a valid email adress',
                        type: 'firebase',
                    })
                else if (error.code === 'auth/missing-email')
                    setError('email', {
                        message: 'Please input an email adress',
                        type: 'firebase',
                    })
                else if (error.code === 'auth/wrong-password')
                    setError('pass', {
                        message: 'Check your password',
                        type: 'firebase',
                    })
                else if (error.code === 'auth/user-not-found')
                    setError('email', {
                        message: 'No account with that email registered',
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
                    history.push('/reviews')
                }
            )
        },
        [history, setUser, socket]
    )

    // Remember email
    useEffect(() => {
        setValue('email', (history.location.state as any)?.email ?? '')
    }, [history.location.state, setValue])

    useRedirectSignedInUser(auth)
    useOAuthHandler(auth, login)

    return (
        <div className="px-6 w-[400px] m-auto min-w-sm max-w-[90%]">
            {/* Form needed for enter to submit */}
            <form
                onSubmit={handleSubmit(signInWithEmail)}
                className="flex flex-col items-left w-full space-y-4"
            >
                <h2 className="m-0 font-bold text-xl self-center">Log in</h2>
                <InputText field="email" register={register} errors={errors} />
                <div>
                    <BorderBox error={!!errors.pass}>
                        <input
                            className="w-full mr-2 focus:outline-none bg-background"
                            placeholder="Password"
                            type="password"
                            {...register('pass', {
                                required: 'Password is required',
                            })}
                        />
                        <button className="focus:outline-none focus:ring-2">
                            <p
                                className="font-semibold text-sm h-auto align-middle text-primaryColor hover:underline"
                                onPointerDown={() =>
                                    history.push({
                                        pathname: '/forgot',
                                        state: { email: getValues('email') },
                                    })
                                }
                            >
                                Forgot?
                            </p>
                        </button>
                    </BorderBox>
                    {errors.pass && (
                        <p className="text-sm font-bold mt-2 text-red-800">
                            {errors.pass?.message}
                        </p>
                    )}
                </div>
                <CommonSubmitButton value="Log in" />
            </form>

            <LineBreak text="OR" />

            <h3 className="m-0 text-sm font-semibold text-center mb-3 mt-4 ">
                Log in with
            </h3>
            <div className="flex gap-4 w-full">
                <button
                    className="flex-grow group focus:outline-none"
                    onClick={() => signInWithGoogle(auth)}
                >
                    <BorderBoxBtn className="justify-center">
                        <GoogleLogo className="-ml-4" />
                        <p>Google</p>
                    </BorderBoxBtn>
                </button>
                <button
                    className="flex-grow group focus:outline-none"
                    onClick={() => signInWithTwitter(auth)}
                >
                    <BorderBoxBtn className="justify-center">
                        <TwitterLogo className="-ml-4" />
                        <p>Twitter</p>
                    </BorderBoxBtn>
                </button>
            </div>

            <div className="flex gap-1 justify-center mt-12">
                <p className="text-sm">No account yet?</p>
                <button
                    className="focus:outline-none focus:ring-2"
                    onClick={() =>
                        history.push({
                            pathname: '/register',
                            state: { email: getValues('email') },
                        })
                    }
                >
                    <p className=" text-sm text-primaryColor hover:underline">
                        Sign up now!
                    </p>
                </button>
            </div>
        </div>
    )
}

export default UserLoginView
