import appleAuth from '@invertase/react-native-apple-authentication'
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

export const signInWithApple = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
        // See: https://github.com/invertase/react-native-apple-authentication#faqs
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned')
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce, email, fullName } = appleAuthRequestResponse
    const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
    )

    // Sign the user in with the credential
    await auth().signInWithCredential(appleCredential)
    if (email) await auth().currentUser?.updateEmail(email)
    if (fullName)
        await auth().currentUser?.updateProfile({
            displayName: fullName.nickname,
        })
}
