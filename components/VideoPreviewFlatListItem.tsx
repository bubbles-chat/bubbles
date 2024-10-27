import { Pressable, StyleSheet, View } from 'react-native'
import { Video } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'

const VideoPreviewFlatListItem = ({ uri, onPress }: { uri: string, onPress: () => any }) => {
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
    }
})