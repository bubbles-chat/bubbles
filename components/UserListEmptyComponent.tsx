import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { ThemedText } from './ThemedText'

const UserListEmptyComponent = ({ query }: { query: string }) => {
    const textColor = useColorScheme() === 'dark' ? Colors.dark.text : Colors.light.text

    return (
        <View style={styles.continer}>
            {query.length === 0 ?
                <>
                    <MaterialIcons
                        name='person-search'
                        color={textColor}
                        size={100}
                    />
                    <ThemedText>Search Bubbles users here</ThemedText>
                </>
                :
                <>
                    <MaterialIcons
                        name='person-remove'
                        color={textColor}
                        size={100}
                    />
                    <ThemedText>Can't find "{query}"</ThemedText>
                </>}
        </View>
    )
}

export default UserListEmptyComponent

const styles = StyleSheet.create({
    continer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})