import React, { FC } from 'react'
import { Text } from 'react-native'

type Props = { text: string }

/** Display the kanji meaning underneath the kanji or kanji builder */
const KanjiMeaning: FC<Props> = ({ text }) => (
   <Text
      style={{ fontFamily: 'noto-black' }}
      className="text-2xl capitalize mt-6"
   >
      {text}
   </Text>
)
export default KanjiMeaning
