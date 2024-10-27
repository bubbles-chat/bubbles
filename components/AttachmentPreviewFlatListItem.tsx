import ImagePreviewFlatListItem from './ImagePreviewFlatListItem'

const AttachmentPreviewFlatListItem = ({ item, onPress }: { item: { uri: string, type: string, name: string }, onPress: () => any }) => {
    if (item.type.includes('image')) {
        return <ImagePreviewFlatListItem uri={item.uri} onPress={onPress} />
    }

    return null
}

export default AttachmentPreviewFlatListItem