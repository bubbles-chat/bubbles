import { StyleSheet, View } from 'react-native'
import { useRef } from 'react'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import { ThemedText } from './ThemedText'

const VideoMessageFlatListItem = ({ uri, name }: { uri: string, name: string }) => {
    const videoRef = useRef<Video>(null)

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
            videoRef.current?.setPositionAsync(0)
            videoRef.current?.pauseAsync()
        }
    }

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri }}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
            <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
        </View>
    )
}

export default VideoMessageFlatListItem

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 200,
        borderRadius: 8,
        backgroundColor: '#000'
    },
    video: {
        width: 200,
        height: 200
    },
    name: {
        position: 'absolute',
        paddingHorizontal: 4,
        paddingTop: 4
    }
})