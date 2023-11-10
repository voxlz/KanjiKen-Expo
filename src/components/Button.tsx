import React, { FC, useState } from 'react'
import { Pressable, Text } from 'react-native'

const themeOptions = {
    forest: {
        bg: 'bg-forest-200',
        press: 'bg-forest-300',
        border: 'border-forest-700',
        text: 'text-ui-text',
    },
} as const

type Props = {
    onPress?: () => void
    text?: string
    style?: keyof typeof themeOptions
}

/** Basic button for button use. Grows to fill available. Configure color pallet. */
const Button: FC<Props> = ({ text, style = 'forest', onPress }) => {
    const theme = themeOptions[style]
    const [pressed, setPressed] = useState(false)

    return (
        <Pressable
            onPress={() => {
                setPressed(false)
                onPress?.()
            }}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            className={`w-full  align-bottom  flex-grow  justify-center rounded-2xl  border-[3px] ${
                pressed ? 'border-b-[3px]' : 'border-b-[5px]'
            } ${pressed ? 'mt-[2px]' : 'mt-[0px]'} ${
                !pressed ? theme.bg : theme.press
            } ${theme.border}`}
        >
            <Text
                style={{ fontFamily: 'NotoSansJP_400Regular' }}
                className={`text-center text-xl -mt-1 text-${theme.text}`}
            >
                {text}
            </Text>
        </Pressable>
    )
}

export default Button
