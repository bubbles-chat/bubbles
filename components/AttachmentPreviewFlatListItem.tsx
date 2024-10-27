import AudioPreviewFlatListItem from './AudioPreviewFlatListItem'
import DocumentPreviewFlatListItem from './DocumentPreviewFlatListItem'
import ImagePreviewFlatListItem from './ImagePreviewFlatListItem'
import VideoPreviewFlatListItem from './VideoPreviewFlatListItem'

const AttachmentPreviewFlatListItem = ({ item, onPress }: { item: { uri: string, type: string, name: string }, onPress: () => any }) => {
    if (item.type.includes('image')) {
        return <ImagePreviewFlatListItem name={item.name} uri={item.uri} onPress={onPress} />
    }

    if (item.type.includes('video')) {
        return <VideoPreviewFlatListItem name={item.name} uri={item.uri} onPress={onPress} />
    }

    if (item.type.includes('audio')) {
        return <AudioPreviewFlatListItem name={item.name} onPress={onPress} uri={item.uri} />
    }

    return <DocumentPreviewFlatListItem name={item.name} onPress={onPress} />
}

export default AttachmentPreviewFlatListItem