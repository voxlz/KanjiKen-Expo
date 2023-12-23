import React, { FC } from 'react'
import { Text as NativeText, StyleProp, TextStyle } from 'react-native'
import { font } from '../utils/fonts'
import { StyledProps } from 'nativewind'

type Props = {
    children: string
    style?: TextStyle
}

/** Wrapper around text to make auto-importing easier, ensure KanjiKen-font is used where possible. */
const Text: FC<StyledProps<Props>> = ({ children, style, className }) => (
    <NativeText
        style={[{ fontFamily: font(children, style?.fontFamily) }, style]}
        className={className}
    >
        {children}
    </NativeText>
)

export default Text
