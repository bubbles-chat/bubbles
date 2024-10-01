import { useThemeColor } from '@/hooks/useThemeColor'
import { CustomTextInputProps } from '@/types/types'
import React from 'react'
import { StyleSheet, View, TextInput, Text } from 'react-native'

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
    const borderColor = useThemeColor({ light: props.lightBorderColor, dark: props.darkBorderColor }, 'text') as string

    return (
        <>
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
            {(props.hasValidation && !props.state.validation?.isValid) && (
                <Text style={styles.message}>{props.state.validation?.message}</Text>
            )}
        </>
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
    },
    message: {
        color: 'red'
    }
})