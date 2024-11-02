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
    onPressOpen
}: AttachmentMessageFlatListItemProps) => {
    const text = useThemeColor({}, 'text') as string

    return (
        <View>
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
                    isDownloading ? <ThemedText>{progress}%</ThemedText> :
                        <Pressable onPress={onPressOpen}>
                            <Ionicons
                                name='open-outline'
                                size={40}
                                color={text}
                            />
                        </Pressable>}
            </View>
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
    },
    centeredView: {
        position: 'absolute',
        alignSelf: 'center',
        top: 80
    }
})