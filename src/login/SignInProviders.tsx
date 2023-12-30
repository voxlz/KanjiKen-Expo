import { AppleButton } from '@invertase/react-native-apple-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import * as AppleAuthentication from 'expo-apple-authentication'
import * as Crypto from 'expo-crypto'
import { router } from 'expo-router'
import React, { FC } from 'react'
import { View, Platform } from 'react-native'

import ProviderBtn from './ProviderBtn'
import GoogleLogo from '../../assets/logos/google.svg'

/** Provide google and apple sign in options */
const SignInProviders: FC = () => (
   <>
      <View style={{ gap: 12 }} className="flex-col w-full">
         <ProviderBtn
            text="Sign in with Google"
            logo={<GoogleLogo height={42} />}
         />
         {Platform.OS === 'ios' && (
            <AppleButton
               cornerRadius={10}
               style={{ height: 50 }}
               buttonStyle={AppleButton.Style.WHITE_OUTLINE}
               buttonType={AppleButton.Type.SIGN_IN}
               onPress={() => {
                  let nickname: string | undefined = undefined
                  let user: string | undefined = undefined
                  let email: string | undefined = undefined

                  const nonce = Math.random().toString(36).substring(2, 10)

                  return Crypto.digestStringAsync(
                     Crypto.CryptoDigestAlgorithm.SHA256,
                     nonce
                  )
                     .then((hashedNonce) =>
                        AppleAuthentication.signInAsync({
                           requestedScopes: [
                              AppleAuthentication.AppleAuthenticationScope
                                 .FULL_NAME,
                              AppleAuthentication.AppleAuthenticationScope
                                 .EMAIL,
                           ],
                           nonce: hashedNonce,
                        })
                     )
                     .then((appleCredential) => {
                        const {
                           identityToken,
                           fullName: name,
                           user: userStr,
                           email: userEmail,
                        } = appleCredential

                        nickname =
                           name?.nickname ?? name?.givenName ?? undefined
                        user = userStr
                        email = userEmail ?? undefined

                        const credential = auth.AppleAuthProvider.credential(
                           identityToken,
                           nonce
                        )

                        return auth().signInWithCredential(credential)
                        // Successful sign in is handled by firebase.auth().onAuthStateChanged
                     })
                     .then(() => {
                        nickname &&
                           auth()
                              .currentUser?.updateProfile({
                                 displayName: nickname,
                              })
                              .then(() =>
                                 console.log('set displayName to', nickname)
                              )

                        user &&
                           AsyncStorage.setItem('appleUserStr', user).then(
                              () => {
                                 console.log('Set appleUserStr', user)
                                 auth().currentUser?.reload()
                              }
                           )

                        email &&
                           auth()
                              .currentUser?.updateEmail(email)
                              .then(() => {
                                 console.log('Set email to', email)
                                 auth().currentUser?.reload()
                              })

                        console.log('signed in')
                        router.back()
                     })
                     .catch((error) => {
                        console.warn(error)
                     })
               }}
            />
         )}
      </View>
   </>
)

export default SignInProviders
