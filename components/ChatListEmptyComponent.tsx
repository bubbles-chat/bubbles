import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { ThemedText } from './ThemedText'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

const ChatListEmptyComponent = () => {
    const textColor = useColorScheme() === 'dark' ? Colors.dark.text : Colors.light.text

    return (
        <View style={styles.container}>
            <Ionicons
                name='chatbubbles'
                size={100}
                color={textColor}
            />
            <ThemedText>You don't have any chats</ThemedText>
        </View>
    )
}

export default ChatListEmptyComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})