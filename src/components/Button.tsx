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
        border: '#AEAEAE',
        text: 'text-ui-text',
        font: 'noto-bold',
        textTransform: 'uppercase',
    },
    danger: {
        bg: 'bg-error-200 ',
        press: 'bg-error-500 ',
        border: '#6C2424',
        text: 'text-error-900',
        font: 'noto-bold',
        textTransform: 'uppercase',
    },
    disabled: {
        bg: ' bg-ui-very_light',
        press: ' bg-ui-light ',
        border: '#AEAEAE',
        text: 'text-ui-light',
        font: 'noto-bold',
        textTransform: 'uppercase',
    },
    choices: {
        bg: ' bg-ui-very_light ',
        press: ' bg-ui-light ',
        border: '#AEAEAE',
        text: 'text-ui-text',
        font: 'klee-bold',
        textTransform: 'none',
    },
    forest: {
        bg: 'bg-forest-200',
        press: 'bg-forest-300',
        border: '#406823',
        text: 'text-forest-900',
        font: 'noto-black',
        textTransform: 'uppercase',
    },
    secondary: {
        bg: 'bg-transparent',
        press: 'bg-transparent',
        border: 'transparent',
        text: 'text-forest-900',
        font: 'noto-bold',
        textTransform: 'none',
    },
} as const

const themePress = {
    wrong: {
        bg: ' bg-error-200 ',
        press: ' bg-error-500 ',
        border: '#6C2424',
        text: 'text-ui-text',
        textTransform: 'none',
    },
    correct: {
        bg: 'bg-forest-200',
        press: 'bg-forest-300',
        border: '#406823',
        text: 'text-ui-text',
        textTransform: 'none',
    },
} as const

export type ButtonStyles = keyof typeof themeOptions

export type BtnProps = {
    onPress?: () => boolean | undefined | void | Promise<void>
    text?: string
    styleName?: ButtonStyles
    lang?: 'eng' | 'jap'
    className?: string
    btnStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    children?: React.ReactElement
}

/** Basic button for button use. Grows to fill available. Configure color pallet. */
const Button: FC<BtnProps> = ({
    text,
    styleName = 'forest',
    onPress,
    lang = 'eng',
    className: btnClass,
    btnStyle,
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
                    if (success === true) {
                        setPressedStyle(success ? 'correct' : 'wrong')
                    }
                }
            }}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            className={
                `w-full  flex-grow  justify-center rounded-xl  border-[3px]  
                ${pressed ? ' border-b-[3px] ' : ' border-b-[5px] '} 
                ${pressed ? ' mt-[2px] ' : ' mt-[0px] '}  
                ${!pressed ? theme.bg : theme.press}  
             ` + btnClass
            }
            style={[{ borderColor: theme.border }, btnStyle]}
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
