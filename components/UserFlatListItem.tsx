import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import User from '@/models/User.model'
import { ThemedText } from './ThemedText'
import { useState } from 'react'

const UserFlatListItem = ({ item, onPressAdd }: { item: User, onPressAdd: () => Promise<void> }) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleAddOnPress = async () => {
        setIsLoading(true)
        await onPressAdd()
        setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            <Image
                source={item.photoURL.length === 0 ? require('@/assets/images/avatar.png') : { uri: item.photoURL }}
                style={styles.image}
            />
            <ThemedText>{item.displayName}</ThemedText>
            {isLoading ? <ActivityIndicator
                size={'large'}
                style={styles.addBtn}
            /> : <TouchableOpacity style={styles.addBtn} onPress={handleAddOnPress}>
                <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>}
        </View>
    )
}

export default UserFlatListItem

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 8,
        backgroundColor: 'lightgrey'
    },
    addBtn: {
        position: 'absolute',
        right: 8,
        padding: 8
    },
    addText: {
        color: 'green'
    }
})