import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native'
import React from 'react'
import { LoadingProps } from '@/types/types'
import { useThemeColor } from '@/hooks/useThemeColor'

const Loading: React.FC<LoadingProps> = ({ lightColor, darkColor, ...rest }) => {
    const color = useThemeColor({ dark: darkColor, light: lightColor }, 'buttonBackground') as string

    return (
        <Modal animationType='none' transparent={true} {...rest}>
            <View style={styles.modalView}>
                <ActivityIndicator color={color} size='large' />
            </View>
        </Modal>
    )
}

export default Loading

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
})