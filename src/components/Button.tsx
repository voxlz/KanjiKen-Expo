import React, { FC, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const themeOptions = {
    normal: {
        bg: ' bg-ui-very_light ',
        press: ' bg-ui-light ',
        border: 'border-ui-disabled',
        text: 'text-ui-text',
        font: 'NotoSansJP_400Regular',
    },
    forest: {
        bg: 'bg-forest-200',
        press: 'bg-forest-300',
        border: 'border-forest-700',
        text: 'text-ui-text',
        font: 'NotoSansJP_400Regular',
    },
    secondary: {
        bg: 'bg-transparent',
        press: 'bg-transparent',
        border: 'border-transparent',
        text: 'text-forest-900',
        font: 'NotoSansJP_900Black',
    },
} as const

const themePress = {
    wrong: {
        bg: ' bg-error-200 ',
        press: ' bg-error-500 ',
        border: 'border-error-900',
        text: 'text-ui-text',
        font: 'NotoSansJP_400Regular',
    },
    correct: {
        bg: 'bg-forest-200',
        press: 'bg-forest-300',
        border: 'border-forest-700',
        text: 'text-ui-text',
        font: 'NotoSansJP_400Regular',
    },
} as const

export type ButtonStyles = keyof typeof themeOptions

type Props = {
    onPress?: () => boolean | undefined | void
    text?: string
    styleName?: ButtonStyles
    lang?: 'eng' | 'jap'
}

/** Basic button for button use. Grows to fill available. Configure color pallet. */
const Button: FC<Props> = ({
    text,
    styleName = 'forest',
    onPress,
    lang = 'eng',
}) => {
    const [pressed, setPressed] = useState(false)
    const [pressedStyle, setPressedStyle] = useState<
        keyof typeof themePress | undefined
    >()

    const theme =
        pressedStyle && pressedStyle
            ? themePress[pressedStyle]
            : themeOptions[styleName]

    return (
        <Pressable
            onPress={() => {
                if (pressedStyle === undefined) {
                    setPressed(false)
                    const success = onPress?.()
                    if (success !== undefined) {
                        setPressedStyle(success ? 'correct' : 'wrong')
                    }
                }
            }}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            className={`w-full  flex-grow  justify-center rounded-2xl  border-[3px]  ${
                pressed ? ' border-b-[3px] ' : ' border-b-[5px] '
            } ${pressed ? ' mt-[2px] ' : ' mt-[0px] '}  ${
                !pressed ? theme.bg : theme.press
            }  ${theme.border}
            `}
        >
            <Text
                style={{
                    fontFamily: theme.font,
                }}
                className={`text-center ${
                    lang === 'eng' ? 'text-xl ' : 'text-4xl -mb-2'
                } -mt-1 ${theme.text} translate-x-1/2 `}
            >
                {text}
            </Text>
        </Pressable>
    )
}

export default Button
