import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/types/types'
import { ThemedText } from './ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Colors } from '@/constants/Colors'

const CustomButton: React.FC<CustomButtonProps> = ({ customBackgroundColor, customTextColor, hasBackground = true, style, ...props }) => {
    const background = useThemeColor({ dark: props.darkBackground, light: props.lightBackground }, 'buttonBackground') as string
    const colorScheme = useColorScheme()
    const text = colorScheme === 'dark' ? Colors.light.text : Colors.dark.text

    return (
        <TouchableOpacity
            style={[
                styles.container,
                hasBackground && { backgroundColor: customBackgroundColor ? customBackgroundColor : background },
                !hasBackground && { borderWidth: 1, borderColor: customBackgroundColor ? customBackgroundColor : background },
                style
            ]}
            {...props}
        >
            {props.Icon && <View style={styles.iconView}>
                {props.Icon}
            </View>}
            <ThemedText style={[
                styles.text,
                {
                    color: customTextColor ? customTextColor : hasBackground ? text : background
                }
            ]}>{props.text}</ThemedText>
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16
    },
    iconView: {
        marginRight: 8
    },
    text: {
        fontSize: 20,
        textAlign: 'center'
    }
})