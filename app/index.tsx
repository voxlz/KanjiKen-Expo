import { Link } from 'expo-router'
import React, { FC } from 'react'
import { Pressable, Text, View } from 'react-native'
import Button from '../src/components/Button'

type Props = {}

/** Homepage of the application. Where you start the exercises for example. */
const Home: FC<Props> = ({}) => (
    <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        className=""
    >
        <Link href="/session" asChild>
            <Button text="Start Session" />
        </Link>
        <Link href="/dictionary" asChild>
            <Button text="Dictionary" />
        </Link>
    </View>
)

export default Home
