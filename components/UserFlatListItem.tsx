import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import User from '@/models/User.model'
import { ThemedText } from './ThemedText'

const UserFlatListItem = ({ item }: { item: User }) => {
    return (
        <View style={styles.container}>
            <Image
                source={item.photoURL.length === 0 ? require('@/assets/images/avatar.png') : { uri: item.photoURL }}
                style={styles.Image}
            />
            <ThemedText>{item.displayName}</ThemedText>
            <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
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
    Image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 8,
        backgroundColor: 'lightgrey'
    },
    addBtn: {
        position: 'absolute',
        right: 8
    },
    addText: {
        color: 'green'
    }
})