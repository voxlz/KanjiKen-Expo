import React, { FC, useState } from 'react'
import { Pressable, StyleProp, Text } from 'react-native'
import { font } from '../utils/fonts'
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

const themeOptions = {
    normal: {
        bg: ' bg-ui-very_light ',
        press: ' bg-ui-light ',
        border: 'border-ui-disabled',
        text: 'text-ui-text',
        font: 'NotoSansJP_700Bold',
        textTransform: 'none',
    },
    choices: {
        bg: ' bg-ui-very_light ',
        press: ' bg-ui-light ',
        border: 'border-ui-disabled',
        text: 'text-ui-text',
        font: 'KleeOne_600SemiBold',
        textTransform: 'none',
    },
    forest: {
        bg: 'bg-forest-200',
        press: 'bg-forest-300',
        border: 'border-forest-700',
        text: 'text-forest-700',
        font: 'NotoSansJP_900Black',
        textTransform: 'uppercase',
    },
    secondary: {
        bg: 'bg-transparent',
        press: 'bg-transparent',
        border: 'border-transparent',
        text: 'text-forest-900',
        font: 'NotoSansJP_700Bold',
        textTransform: 'none',
    },
} as const

const themePress = {
    wrong: {
        bg: ' bg-error-200 ',
        press: ' bg-error-500 ',
        border: 'border-error-900',
        text: 'text-ui-text',
        textTransform: 'none',
    },
    correct: {
        bg: 'bg-forest-200',
        press: 'bg-forest-300',
        border: 'border-forest-700',
        text: 'text-ui-text',
        textTransform: 'none',
    },
} as const

export type ButtonStyles = keyof typeof themeOptions

export type BtnProps = {
    onPress?: () => boolean | undefined | void
    text?: string
    styleName?: ButtonStyles
    lang?: 'eng' | 'jap'
    style?: StyleProp<ViewProps>
}

/** Basic button for button use. Grows to fill available. Configure color pallet. */
const Button: FC<BtnProps> = ({
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
            ? { ...themeOptions[styleName], ...themePress[pressedStyle] }
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
                    fontFamily: font(text, theme.font),
                    textTransform: theme.textTransform,
                }}
                className={`text-center  ${
                    lang === 'eng' ? 'text-lg text' : 'text-4xl -mb-2'
                } -mt-1 ${theme.text} translate-x-1/2 `}
            >
                {text}
            </Text>
        </Pressable>
    )
}

export default Button
