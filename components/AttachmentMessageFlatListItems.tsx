import AttachmentUrl from '@/models/AttachmentUrl.model'
import ImageMessageFlatListItem from './ImageMessageFlatListItem'
import VideoMessageFlatListItem from './VideoMessageFlatListItem'
import AudioMessageFlatListItem from './AudioMessageFlatListItem'
import DocumentMessageFlatListItem from './DocumentMessageFlatListItem'

const AttachmentMessageFlatListItems = ({ item }: { item: AttachmentUrl }) => {
    if (item.mimeType.includes('image')) {
        return <ImageMessageFlatListItem uri={item.url} name={item.name} />
    }

    if (item.mimeType.includes('video')) {
        return <VideoMessageFlatListItem uri={item.url} name={item.name} />
    }

    if (item.mimeType.includes('audio')) {
        return <AudioMessageFlatListItem uri={item.url} name={item.name} />
    }

    return <DocumentMessageFlatListItem uri={item.url} name={item.name} />
}

export default AttachmentMessageFlatListItems