import {
    Auth,
    getAuth,
    signInWithRedirect,
    TwitterAuthProvider,
} from 'firebase/auth'

import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { router } from 'expo-router'

GoogleSignin.configure({})

export const signInWithGoogle = async () => {
    if (await GoogleSignin.hasPlayServices()) {
        GoogleSignin.signIn({})
            .then((user) => {
                console.log('signed in with google', user)
                router.back()
            })
            .catch((err) => console.log('err', err))
    }
}

export const signInWithTwitter = async (auth: Auth) => {
    const provider = new TwitterAuthProvider()
    await signInWithRedirect(auth, provider)
}
