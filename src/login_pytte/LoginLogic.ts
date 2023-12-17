import auth from '@react-native-firebase/auth'

import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { router } from 'expo-router'

GoogleSignin.configure({})

export const signInWithGoogle = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn()

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken)

    // Sign-in the user with the credential
    return auth()
        .signInWithCredential(googleCredential)
        .then((user) => {
            console.log('signed in with google', user)
            router.back()
        })
        .catch((err) => console.log('err', err))
}

export const signInWithTwitter = async () => {
    // const provider = new TwitterAuthProvider()
    // await signInWithRedirect(auth, provider)
}
