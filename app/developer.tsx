import React from 'react'
import { View } from 'react-native'
import StyledButton from '../src/components/StyledButton'
import { Stack } from 'expo-router'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'
import { useContext } from '../src/utils/react'

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
                text="delete save"
                styleName="danger"
                onPress={scheduler.clear}
            />
        </View>
    )
}
