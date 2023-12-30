import React, { FC } from 'react'
import { View } from 'react-native'

import Button, { BtnProps } from './Button'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import { useContext } from '../utils/react'

/** Convenice wrapper for default button styling */
const StyledButton: FC<BtnProps> = ({ text, onPress, styleName, lang }) => {
   const glyphWidth = useContext(GlyphWidthContext)
   return (
      <View style={{ height: 0.75 * glyphWidth }} className="self-stretch">
         <Button
            text={text}
            onPress={onPress}
            styleName={styleName}
            lang={lang}
         />
      </View>
   )
}

export default StyledButton
