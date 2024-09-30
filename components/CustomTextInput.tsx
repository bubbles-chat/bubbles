import { useThemeColor } from '@/hooks/useThemeColor'
import { CustomTextInputProps } from '@/types/types'
import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
    const borderColor = useThemeColor({ light: props.lightBorderColor, dark: props.darkBorderColor }, 'text') as string

    return (
        <View style={[
            styles.container,
            props.style,
            {
                borderColor: props.hasValidation ?
                    props.state.validation?.isValid ? borderColor : 'red' : borderColor
            }
        ]}>
            {props.Icon}
            <TextInput
                {...props}
                style={[styles.textInput, { color: borderColor }]}
                value={props.state.value}
                placeholderTextColor={borderColor}
            />
        </View>
    )
}

export default CustomTextInput

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 8,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        marginLeft: 8,
        flex: 1
    }
})