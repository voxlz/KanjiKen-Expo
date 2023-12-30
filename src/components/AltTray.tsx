import React, { FC } from 'react'
import { View } from 'react-native'

import Alternative from './Alternative.1'

type Props = {
   alts: { glyph: string }[]
}

/** Tray to contain the alternatives. */
const AltTray: FC<Props> = ({ alts }) => <></>

export default AltTray
