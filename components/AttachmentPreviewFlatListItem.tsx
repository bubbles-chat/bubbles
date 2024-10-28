import AudioPreviewFlatListItem from './AudioPreviewFlatListItem'
import DocumentPreviewFlatListItem from './DocumentPreviewFlatListItem'
import ImagePreviewFlatListItem from './ImagePreviewFlatListItem'
import VideoPreviewFlatListItem from './VideoPreviewFlatListItem'
import * as DocumentPicker from 'expo-document-picker'

const AttachmentPreviewFlatListItem = ({ item, onPress }: { item: DocumentPicker.DocumentPickerAsset, onPress: () => any }) => {
    if (item.mimeType?.includes('image')) {
        return <ImagePreviewFlatListItem name={item.name} uri={item.uri} onPress={onPress} />
    }

    if (item.mimeType?.includes('video')) {
        return <VideoPreviewFlatListItem name={item.name} uri={item.uri} onPress={onPress} />
    }

    if (item.mimeType?.includes('audio')) {
        return <AudioPreviewFlatListItem name={item.name} onPress={onPress} uri={item.uri} />
    }

    return <DocumentPreviewFlatListItem name={item.name} onPress={onPress} />
}

export default AttachmentPreviewFlatListItem