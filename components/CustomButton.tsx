import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/types/types'
import { ThemedText } from './ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'

const CustomButton: React.FC<CustomButtonProps> = ({ hasBackground = true, ...props }) => {
    const background = useThemeColor({ dark: props.darkBackground, light: props.lightBackground }, 'buttonBackground') as string

    return (
        <TouchableOpacity
            style={[
                styles.container,
                hasBackground && { backgroundColor: background },
                !hasBackground && { borderWidth: 1, borderColor: background },
                props.style
            ]}
            {...props}
        >
            {props.Icon && <View style={styles.iconView}>
                {props.Icon}
            </View>}
            <ThemedText style={styles.text}>{props.text}</ThemedText>
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