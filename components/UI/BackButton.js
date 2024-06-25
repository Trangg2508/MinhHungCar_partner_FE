import { Alert, Button, Text, View } from 'react-native'
import React, { Component } from 'react'
import { useNavigation } from '@react-navigation/native'

export default function BackButton({ title, subTitle, callBack }) {
    const navigate = useNavigation()
    return (
        <View>
            <Button onPress={() => {
                Alert.alert(title,
                    subTitle
                    ,
                    [
                        { text: "Ở lại", onPress: () => { } },
                        { text: "Trở về", style: "destructive", onPress: callBack }
                    ]
                )
            }} style={{ color: "blue" }} title='Trở về' />
        </View>
    )

}