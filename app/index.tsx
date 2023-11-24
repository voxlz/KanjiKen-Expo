import { Link } from 'expo-router'
import React, { FC } from 'react'
import { View } from 'react-native'
import StyledButton from '../src/components/StyledButton'

type Props = {}

/** Homepage of the application. Where you start the exercises for example. */
const Home: FC<Props> = ({}) => (
    <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        className=""
    >
        <Link href="/session" asChild>
            <StyledButton text="Start Session" />
        </Link>
        <Link href="/dictionary" asChild>
            <StyledButton text="Dictionary" />
        </Link>
    </View>
)

export default Home
