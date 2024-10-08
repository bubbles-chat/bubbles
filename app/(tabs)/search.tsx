import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'

const Search = () => {
    return (
        <ThemedView style={styles.container}>
            <Text>Search</Text>
        </ThemedView>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})