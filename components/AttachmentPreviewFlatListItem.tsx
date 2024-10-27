import ImagePreviewFlatListItem from './ImagePreviewFlatListItem'
import VideoPreviewFlatListItem from './VideoPreviewFlatListItem'

const AttachmentPreviewFlatListItem = ({ item, onPress }: { item: { uri: string, type: string, name: string }, onPress: () => any }) => {
    if (item.type.includes('image')) {
        return <ImagePreviewFlatListItem uri={item.uri} onPress={onPress} />
    }

    if (item.type.includes('video')) {
        return <VideoPreviewFlatListItem uri={item.uri} onPress={onPress} />
    }

    return null
}

export default AttachmentPreviewFlatListItem