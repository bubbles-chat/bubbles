import { Image, StyleSheet, View } from 'react-native'

const ImageMessageFlatListItem = ({ uri }: { uri: string }) => {
    return (
        <View>
            <Image
                style={styles.image}
                source={{ uri }}
                resizeMode='cover'
            />
        </View>
    )
}

export default ImageMessageFlatListItem

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 8
    }
})