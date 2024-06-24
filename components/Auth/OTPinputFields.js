import { View, Text, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { GlobalStyles } from '../../constants/style';
export const OtpInput = ({ numberOfInputs, onChangeText }) => {
    const [pins, setPins] = useState(Array(numberOfInputs).fill(''));
    const inputRefs = useRef(Array(numberOfInputs).fill(null));

    const handleTextChange = (text, index) => {
        const newPins = [...pins];
        newPins[index] = text;
        setPins(newPins);

        // Handle automatic field switching
        if (text.length === 1 && index < numberOfInputs - 1) {
            inputRefs.current[index + 1].focus(); // Jump to next field
        } else if (text.length === 0 && index > 0) {
            inputRefs.current[index - 1].focus(); // Go back to previous field
        }

        onChangeText(newPins.join('')); // Pass the complete OTP
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
            {pins.map((pin, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    value={pin}
                    onChangeText={(text) => handleTextChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    style={{
                        width: 50,
                        borderWidth: 1,
                        borderColor: GlobalStyles.colors.backgroundColorPrimary200,
                        padding: 10,
                        textAlign: 'center',
                        borderRadius: 6
                    }}
                />
            ))}
        </View>
    );
};