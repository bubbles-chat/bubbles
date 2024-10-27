import { Ionicons } from '@expo/vector-icons'
import { Image, Pressable, StyleSheet, View } from 'react-native'

const ImagePreviewFlatListItem = ({ uri, onPress }: { uri: string, onPress: () => any }) => {
    return (
        <View>
            <Image
                style={styles.constainer}
                source={{ uri }}
            />
            <Pressable style={styles.pressable} onPress={onPress}>
                <Ionicons
                    name='close-circle'
                    color={'#fff'}
                    size={18}
                />
            </Pressable>
        </View>
    )
}

export default ImagePreviewFlatListItem

const styles = StyleSheet.create({
    constainer: {
        height: 100,
        width: 100,
        borderRadius: 16
    },
    pressable: {
        position: 'absolute',
        top: 4,
        right: 4,
        padding: 4
    }
})