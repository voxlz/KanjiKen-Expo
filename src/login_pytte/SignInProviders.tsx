import React, { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { BorderBoxBtn } from './LoginHelperComponents'
import { signInWithGoogle, signInWithApple } from './LoginLogic'
import GoogleLogo from '../../assets/logos/google.svg'
import TwitterLogo from '../../assets/logos/twitter.svg'
import ProviderBtn from './ProviderBtn'
import { AppleButton } from '@invertase/react-native-apple-authentication'

type Props = {}

/** Provide google and apple sign in options */
const SignInProviders: FC<Props> = ({}) => (
    <>
        <View style={{ gap: 12 }} className="flex-col w-full">
            <ProviderBtn
                text="Sign in with Google"
                logo={<GoogleLogo height={42} />}
            />
            <AppleButton
                cornerRadius={10}
                style={{ height: 50 }}
                buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                buttonType={AppleButton.Type.SIGN_IN}
                onPress={() =>
                    signInWithApple().catch((err) =>
                        console.log('Sign in with apple failed', err)
                    )
                }
            />
        </View>
    </>
)

export default SignInProviders
