import { View, Text, StyleProp, ViewStyle } from 'react-native'
import React from 'react'
import { font } from '../utils/fonts'

type Props = {
    text?: string
    style?: StyleProp<ViewStyle>
}

const Interactable = ({ text, style }: Props) => {
    return (
        <View
            style={style}
            className="flex-grow flex-shrink flex-col bg-ui-very_light rounded-xl border-[3px] border-b-[5px] border-ui-disabled"
        >
            {/* Oh this? This bad boy is to ensure smooth text animation when rescaling the width and height.  I love web dev.*/}
            <View className="flex-grow" />
            <View className="flex-row">
                <View className="flex-grow" />
                <View>
                    <Text
                        style={{
                            fontFamily: font(text, 'KleeOne_600SemiBold'),
                        }}
                        className=" text-ui-text text-4xl leading-none"
                    >
                        {text}
                    </Text>
                </View>
                <View className="flex-grow " />
            </View>
            <View className="flex-grow " />
        </View>
    )
}

export default Interactable
