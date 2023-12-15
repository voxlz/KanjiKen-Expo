import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import React, { FC, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import InputText from '../components/common/InputText'
import { Form } from '../components/LoginHelperComponents'
import UserContext from '../contexts/UserContext'
import { useRedirectSignedInUser } from '../hooks/useLoginRedirect'

const UserForgotView: FC<{ email?: string }> = ({ email }) => {
    const { fireApp } = useContext(UserContext)
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<Form>()
    const history = useHistory()
    const auth = getAuth(fireApp)
    const [sentEmail, setSentEmail] = useState(false)

    useEffect(() => {
        setValue('email', (history.location.state as any)?.email ?? '')
    }, [email, history.location.state, setValue])

    useRedirectSignedInUser(auth)

    const resetPassword = () => {
        const email = getValues('email')

        if (
            !sentEmail &&
            email &&
            email.trim() !== '' &&
            RegExp(/^[^\s@]+@[^\s@]+$/).test(email.trim())
        ) {
            console.log('valid mail')
            sendPasswordResetEmail(auth, email).then(() => setSentEmail(true))
        }
    }

    return (
        <div className="px-6 w-[400px] m-auto min-w-sm max-w-[90%]">
            {/* Form needed for enter to submit */}
            <form
                onSubmit={handleSubmit(resetPassword)}
                className="flex flex-col justify-center items-center w-full"
            >
                <h2 className=" m-0 font-bold text-xl mb-4">
                    {!sentEmail
                        ? 'Reset Password'
                        : 'Success! Check your mail inbox.'}
                </h2>
                <InputText field="email" register={register} errors={errors} />

                <input
                    type="submit"
                    value={
                        !sentEmail ? 'Send Reset Email' : 'Send Another Email?'
                    }
                    className={
                        'px-3 rounded-xl w-full flex h-11 items-center justify-center text-white text-md font-bold focus:outline-none focus:ring-2 ' +
                        (!sentEmail ? 'bg-primaryColor ' : 'bg-weakColor')
                    }
                />
            </form>

            <div className="flex gap-1 justify-center mt-12">
                <p className="text-sm">Know the password?</p>
                <button
                    className="focus:outline-none focus:ring-2"
                    onPointerDown={() => history.push('/login')}
                >
                    <p className=" text-sm text-primaryColor">Log in now!</p>
                </button>
            </div>
        </div>
    )
}

export default UserForgotView
