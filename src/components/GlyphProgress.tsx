import React, { FC } from 'react'
import { View } from 'react-native'
import Svg, { ClipPath, Rect, Circle, Path } from 'react-native-svg'

import Button from './Button'
import { GlyphInfo } from '../contexts/ChallengeContextProvider'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import { SchedulerContext } from '../contexts/SchedulerContextProvider'
import { glyphDict } from '../data/glyphDict'
import { useContext } from '../utils/react'

type Props = {
   glyphInfo: GlyphInfo
}

/** Forgot to write a component discription. */
const GlyphProgress: FC<Props> = ({ glyphInfo: alt }) => {
   const scheduler = useContext(SchedulerContext)
   const glyphWidth = useContext(GlyphWidthContext)
   const prog = scheduler.getProgress()

   const width = (glyphWidth * 15.5) / 20
   const radius = width
   const lvl = glyphDict[alt.glyph].comps.position
      ? prog[alt.glyph]?.skills.compose ?? 0
      : prog[alt.glyph]?.skills.recognize ?? 0
   let degrees: number
   let state: 'new' | 'learned' | 'maxed'
   if (lvl < 5) {
      degrees = (lvl / 5) * 360
      state = 'new'
   } else if (lvl < 10) {
      degrees = ((lvl - 5) / 5) * 360
      state = 'learned'
   } else {
      degrees = 0
      state = 'maxed'
   }
   const angle = (degrees * Math.PI) / 180
   const x = ((Math.fround(Math.sin(angle)) + 1) / 2) * width * 2
   const y = ((Math.fround(Math.cos(angle) * -1) + 1) / 2) * width * 2

   return (
      <View className="relative">
         <View
            style={{
               width,
               height: width,
            }}
         >
            <Button
               text={alt.glyph}
               lang="jap"
               styleName="choices"
               btnStyle={{
                  backgroundColor: 'transparent',
                  borderColor:
                     state === 'new'
                        ? '#666666'
                        : state === 'learned'
                          ? '#326A00'
                          : '#B58D00',
               }}
               textStyle={{
                  fontSize: 34,
                  lineHeight: 38,
               }}
            />
         </View>
         <Svg
            className="bg-transparent absolute -z-10"
            style={{
               width: width * 2,
               height: width * 2,
               margin: -width / 2,
            }}
            clipPath="#roundedRect"
         >
            <ClipPath id="roundedRect">
               <Rect
                  x={width / 2 + 1}
                  y={width / 2 + 1}
                  width={width - 2}
                  height={width - 2}
                  rx="13"
                  ry="13"
               />
            </ClipPath>
            {/* Background  */}
            <Circle
               fill={
                  state === 'new'
                     ? '#ECEAEA'
                     : state === 'learned'
                       ? '#9DE55F'
                       : '#FFD600'
               }
               cx={width}
               cy={width}
               r={width}
               clipPath="#roundedRect"
            />
            {/* Filled in part */}
            <Path
               fill={
                  state === 'new'
                     ? '#9DE55F'
                     : state === 'learned'
                       ? '#65D800'
                       : undefined
               }
               d={`M ${width} ${width} 
                   L ${width} 0 
                   A ${radius} ${radius} 0 
                   ${degrees >= 180 ? 1 : 0} 1 ${x} ${y}
                  `}
               clipPath="#roundedRect"
            />
         </Svg>
      </View>
   )
}

export default GlyphProgress
