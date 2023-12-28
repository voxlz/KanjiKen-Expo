import React, { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { BorderBoxBtn } from './LoginHelperComponents'
import { signInWithGoogle, signInWithApple } from './LoginLogic'
import GoogleLogo from '../../assets/logos/google.svg'
import TwitterLogo from '../../assets/logos/twitter.svg'
import ProviderBtn from './ProviderBtn'
import { AppleButton } from '@invertase/react-native-apple-authentication'

import * as AppleAuthentication from 'expo-apple-authentication'
import * as Crypto from 'expo-crypto'
import { firebase } from '@react-native-firebase/firestore'

type Props = {}

/** Provide google and apple sign in options */
const SignInProviders: FC<Props> = ({}) => (
    <>
        <View style={{ gap: 12 }} className="flex-col w-full">
            <ProviderBtn
                text="Sign in with Google"
                logo={<GoogleLogo height={42} />}
            />
            {true && (
                <AppleButton
                    cornerRadius={10}
                    style={{ height: 50 }}
                    buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    onPress={() => {
                        const nonce = Math.random()
                            .toString(36)
                            .substring(2, 10)

                        return Crypto.digestStringAsync(
                            Crypto.CryptoDigestAlgorithm.SHA256,
                            nonce
                        )
                            .then((hashedNonce) =>
                                AppleAuthentication.signInAsync({
                                    requestedScopes: [
                                        AppleAuthentication
                                            .AppleAuthenticationScope.FULL_NAME,
                                        AppleAuthentication
                                            .AppleAuthenticationScope.EMAIL,
                                    ],
                                    nonce: hashedNonce,
                                })
                            )
                            .then((appleCredential) => {
                                const { identityToken } = appleCredential
                                const provider =
                                    new firebase.auth.OAuthProvider('apple.com')
                                const credential = provider.credential(
                                    identityToken!,
                                    nonce
                                )
                                return firebase
                                    .auth()
                                    .signInWithCredential(credential)
                                // Successful sign in is handled by firebase.auth().onAuthStateChanged
                            })
                            .catch((error) => {
                                // ...
                            })
                    }}
                />
            )}
        </View>
    </>
)

export default SignInProviders
