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
        <View>
            <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri }}
                resizeMode={ResizeMode.COVER}
                useNativeControls
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
            <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
        </View>
    )
}

export default VideoMessageFlatListItem

const styles = StyleSheet.create({
    video: {
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