import React from 'react'
import { View } from 'react-native'
import StyledButton from '../src/components/StyledButton'
import { Stack, router } from 'expo-router'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'
import { useContext } from '../src/utils/react'
import * as AppleAuthentication from 'expo-apple-authentication'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Props = {}

export default function developer({}: Props) {
    const scheduler = useContext(SchedulerContext)
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'space-around',
                gap: 12,
            }}
            className="px-8"
        >
            <Stack.Screen
                options={{
                    // https://reactnavigation.org/docs/headers#setting-the-header-title
                    title: 'My home',
                    // https://reactnavigation.org/docs/headers#adjusting-header-styles
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#000',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerShown: true,
                }}
            />
            <StyledButton
                text="delete local save and cashe"
                styleName="danger"
                onPress={() => {
                    scheduler.clearUserData()
                    AsyncStorage.clear()
                }}
            />
            <StyledButton
                text="delete apple account"
                styleName="danger"
                onPress={async () => {
                    // Get an authorizationCode from Apple
                    const { authorizationCode } =
                        await AppleAuthentication.refreshAsync({
                            user:
                                (await AsyncStorage.getItem('appleUserStr')) ??
                                '',
                        })

                    // Ensure Apple returned an authorizationCode
                    if (!authorizationCode) {
                        throw new Error(
                            'Apple Revocation failed - no authorizationCode returned'
                        )
                    }

                    // Revoke the token
                    auth()
                        .revokeToken(authorizationCode)
                        .then(() => {
                            auth()
                                .currentUser?.delete()
                                .then(() => {
                                    router.back()
                                })
                        })
                        .catch((err) => console.error('err'))
                    console.log('token Revoked')
                }}
            />
        </View>
    )
}
