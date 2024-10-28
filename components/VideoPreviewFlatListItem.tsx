import { Pressable, StyleSheet, View } from 'react-native'
import { Video } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from './ThemedText'

const VideoPreviewFlatListItem = ({ name, uri, onPress }: { name: string, uri: string, onPress: () => any }) => {
    return (
        <View>
            <Video
                style={styles.constainer}
                source={{ uri }}
                isLooping
                shouldPlay
                volume={0}
            />
            <Pressable style={styles.pressable} onPress={onPress}>
                <Ionicons
                    name='close-circle'
                    color={'#fff'}
                    size={18}
                />
            </Pressable>
            <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
        </View>
    )
}

export default VideoPreviewFlatListItem

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
    },
    name: {
        fontSize: 10,
        position: 'absolute',
        bottom: 4
    }
})