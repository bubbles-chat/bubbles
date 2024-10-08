import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'

const Connections = () => {
    return (
        <ThemedView style={styles.container}>
            <Text>Connections</Text>
        </ThemedView>
    )
}

export default Connections

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})