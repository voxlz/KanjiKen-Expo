import React, { FC } from 'react'
import { Pressable, View, Text } from 'react-native'
import { BorderBoxBtn } from './LoginHelperComponents'
import { signInWithGoogle } from './LoginLogic'

type Props = {
    logo: React.ReactNode
    text: string
}

/** Login provider common styling */
const ProviderBtn: FC<Props> = ({ logo, text }) => (
    <Pressable
        className="flex-grow group focus:outline-none"
        onPress={() =>
            signInWithGoogle().catch((err) =>
                console.log('sign in with google failed', err)
            )
        }
    >
        <BorderBoxBtn className="justify-center flex-grow pr-1">
            <View className="flex-row justify-between items-center flex-grow -ml-1">
                <View className="-ml-3 -mr-1">{logo}</View>
                <Text className="text-lg font-semibold">{text}</Text>
            </View>
        </BorderBoxBtn>
    </Pressable>
)

export default ProviderBtn
