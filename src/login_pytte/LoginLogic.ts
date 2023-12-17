import auth from '@react-native-firebase/auth'

import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { router } from 'expo-router'

GoogleSignin.configure({
    webClientId:
        '664861145037-kp5gtqeo02bjoha74nqeglg8q5b1vdo7.apps.googleusercontent.com',
})

export const signInWithGoogle = async () => {
    // Check if your device supports Google Play
    const hasPlay = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
    })

    if (hasPlay) {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn()

        if (idToken) {
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
        } else {
            console.log('no idToken found')
        }
    } else {
        console.log('has no play: Google login wont work.')
    }
}

export const signInWithTwitter = async () => {
    // const provider = new TwitterAuthProvider()
    // await signInWithRedirect(auth, provider)
}
