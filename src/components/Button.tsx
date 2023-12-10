import React, { FC, useState } from 'react'
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native'
import { font } from '../utils/fonts'
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'
import tailwindConfig from '../../tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig)

// fullConfig.theme?.extend?.colors['forest']

const themeOptions = {
    normal: {
        bg: ' bg-ui-very_light',
        press: ' bg-ui-light ',
        border: 'border-ui-disabled',
        text: 'text-ui-text',
        font: 'noto-bold',
        textTransform: 'none',
    },
    choices: {
        bg: ' bg-ui-very_light ',
        press: ' bg-ui-light ',
        border: 'border-ui-disabled',
        text: 'text-ui-text',
        font: 'klee-bold',
        textTransform: 'none',
    },
    forest: {
        bg: 'bg-forest-200',
        press: 'bg-forest-300',
        border: 'border-forest-700',
        text: 'text-forest-700',
        font: 'noto-black',
        textTransform: 'uppercase',
    },
    secondary: {
        bg: 'bg-transparent',
        press: 'bg-transparent',
        border: 'border-transparent',
        text: 'text-forest-900',
        font: 'noto-bold',
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
    btnClass?: string
    // btnStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}

/** Basic button for button use. Grows to fill available. Configure color pallet. */
const Button: FC<BtnProps> = ({
    text,
    styleName = 'forest',
    onPress,
    lang = 'eng',
    btnClass,
    textStyle,
}) => {
    const [pressed, setPressed] = useState(false)
    const [pressedStyle, setPressedStyle] = useState<
        keyof typeof themePress | undefined
    >()

    const theme =
        pressedStyle && themeOptions
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
            className={
                `
                w-full  flex-grow  justify-center rounded-xl  border-[3px]  
                ${pressed ? ' border-b-[3px] ' : ' border-b-[5px] '} 
                ${pressed ? ' mt-[2px] ' : ' mt-[0px] '}  
                ${!pressed ? theme.bg : theme.press}  
                ${theme.border}
            ` + btnClass
            }
        >
            <Text
                style={[
                    {
                        fontFamily: font(text, theme.font),
                        textTransform: theme.textTransform,
                    },
                    textStyle,
                ]}
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
