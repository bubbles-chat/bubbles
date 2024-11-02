import { Pressable, StyleSheet, View } from 'react-native'
import { useRef } from 'react'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import { ThemedText } from './ThemedText'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AttachmentMessageFlatListItemProps } from '@/types/types'

const VideoMessageFlatListItem = ({
    uri,
    name,
    doesExist,
    progress,
    isDownloading,
    onPressDownload,
    onPressShare
}: AttachmentMessageFlatListItemProps) => {
    const videoRef = useRef<Video>(null)
    const text = useThemeColor({}, 'text') as string

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
            <View style={styles.centeredView}>
                {!doesExist && !isDownloading ? <Pressable onPress={onPressDownload}>
                    <Ionicons
                        name='download-outline'
                        size={40}
                        color={text}
                    />
                </Pressable> : isDownloading ? <ThemedText>{progress}</ThemedText> : null}
            </View>
            <View style={styles.header}>
                <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
                {doesExist && <Pressable onPress={onPressShare}>
                    <Ionicons
                        name='share-outline'
                        color={text}
                        size={30}
                    />
                </Pressable>}
            </View>
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
    header: {
        position: 'absolute',
        paddingHorizontal: 4,
        paddingTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 200
    },
    centeredView: {
        position: 'absolute',
        alignSelf: 'center',
        top: 80
    },
    name: {
        flex: 0.8
    }
})