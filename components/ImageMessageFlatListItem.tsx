import { Image, Pressable, StyleSheet, View } from 'react-native'
import { ThemedText } from './ThemedText'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AttachmentMessageFlatListItemProps } from '@/types/types'

const ImageMessageFlatListItem = ({
    uri,
    name,
    doesExist,
    progress,
    isDownloading,
    onPressDownload,
    onPressOpen,
    onPressShare
}: AttachmentMessageFlatListItemProps) => {
    const text = useThemeColor({}, 'text') as string

    return (
        <Pressable onPress={doesExist ? onPressOpen : undefined}>
            <Image
                style={styles.image}
                source={{ uri }}
                resizeMode='cover'
            />
            <View style={styles.centeredView}>
                {!doesExist && !isDownloading ? <Pressable onPress={onPressDownload}>
                    <Ionicons
                        name='download-outline'
                        size={40}
                        color={text}
                    />
                </Pressable> :
                    isDownloading ? <ThemedText>{progress}%</ThemedText> : null}
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
        </Pressable>
    )
}

export default ImageMessageFlatListItem

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 8
    },
    header: {
        position: 'absolute',
        paddingHorizontal: 4,
        paddingTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
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