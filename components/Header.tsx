import { Pressable, StatusBar, StyleSheet, useColorScheme } from 'react-native'
import React, { useMemo } from 'react'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { getHeaderTitle } from '@react-navigation/elements'
import { BlurView } from 'expo-blur'
import { ThemedText } from './ThemedText'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

const Header = ({ navigation, options, route, back }: NativeStackHeaderProps) => {
    const title = getHeaderTitle(options, route.name)
    const statusHeight = StatusBar.currentHeight
    const colorScheme = useColorScheme()
    const iconColor = useMemo(() => colorScheme === 'dark' ? Colors.dark.text : Colors.light.text, [colorScheme])

    return (
        <BlurView intensity={80} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={[styles.container, { paddingTop: statusHeight ? statusHeight + 20 : 20 }]}>
            {back && <Pressable style={styles.backBtn} onPress={navigation.goBack}>
                <Ionicons name='arrow-back' color={iconColor} size={20} />
            </Pressable>}
            <ThemedText style={styles.text}>{title}</ThemedText>
        </BlurView>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        overflow: 'hidden'
    },
    text: {
        marginLeft: 8,
        fontSize: 20
    },
    backBtn: {
        padding: 8
    }
})