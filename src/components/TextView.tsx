import { StyledProps } from 'nativewind'
import React, { FC } from 'react'
import { Text as NativeText, TextStyle } from 'react-native'

import { font } from '../utils/fonts'

type Props = {
   text?: string
   style?: TextStyle
}

/** Wrapper around text to make auto-importing easier, ensure KanjiKen-font is used where possible. */
const TextView: FC<StyledProps<Props>> = ({ text, style, className }) => (
   <NativeText
      style={[{ fontFamily: font(text, style?.fontFamily) }, style]}
      className={className}
   >
      {text}
   </NativeText>
)

export default TextView
