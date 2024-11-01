import { Image, StyleSheet, View } from 'react-native'
import { ThemedText } from './ThemedText'

const ImageMessageFlatListItem = ({ uri, name }: { uri: string, name: string }) => {
    return (
        <View>
            <Image
                style={styles.image}
                source={{ uri }}
                resizeMode='cover'
            />
            <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
        </View>
    )
}

export default ImageMessageFlatListItem

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 8
    },
    name: {
        position: 'absolute',
        paddingHorizontal: 4,
        paddingTop: 4
    }
})