import { Image, StyleSheet, View } from 'react-native'
import { ThemedText } from './ThemedText'
import User from '@/models/User.model'

const ConnectionsFlatListItem = ({ item }: { item: User }) => {
    return (
        <View style={styles.container}>
            <Image
                source={item.photoURL?.length === 0
                    ? require('@/assets/images/avatar.png')
                    : { uri: item.photoURL }}
                style={styles.image}
            />
            <ThemedText>{item.displayName}</ThemedText>
        </View>
    )
}

export default ConnectionsFlatListItem

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
    }
})