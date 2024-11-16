import { useThemeColor } from '@/hooks/useThemeColor'
import { CustomTextInputProps } from '@/types/types'
import React from 'react'
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native'

const CustomTextInput: React.FC<CustomTextInputProps> = ({ style, customBorderColor, customTextColor, ...props }) => {
    const borderColor = useThemeColor({ light: props.lightBorderColor, dark: props.darkBorderColor }, 'text') as string

    return (
        <>
            <View style={[
                styles.container,
                style,
                {
                    borderColor: props.hasValidation ?
                        props.state.validation?.isValid ? customBorderColor ?
                            customBorderColor : borderColor :
                            'red' : customBorderColor ?
                            customBorderColor : borderColor
                }
            ]}>
                {props.Icon}
                <TextInput
                    {...props}
                    style={[styles.textInput, { color: customTextColor ? customTextColor : borderColor }]}
                    value={props.state.value}
                    placeholderTextColor={customTextColor ? customTextColor : borderColor}
                    cursorColor={customTextColor ? customTextColor : borderColor}
                />
                {props.pressableIcon ? <Pressable style={styles.pressable} onPress={props.pressableOnPress}>{props.pressableIcon}</Pressable> : null}
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
    },
    pressable: {
        padding: 8
    }
})