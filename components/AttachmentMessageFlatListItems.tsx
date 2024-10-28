import AttachmentUrl from '@/models/attachmentUrl.model'
import ImageMessageFlatListItem from './ImageMessageFlatListItem'
import VideoMessageFlatListItem from './VideoMessageFlatListItem'
import AudioMessageFlatListItem from './AudioMessageFlatListItem'
import DocumentMessageFlatListItem from './DocumentMessageFlatListItem'

const AttachmentMessageFlatListItems = ({ item }: { item: AttachmentUrl }) => {
    if (item.mimeType.includes('image')) {
        return <ImageMessageFlatListItem uri={item.url} />
    }

    if (item.mimeType.includes('video')) {
        return <VideoMessageFlatListItem uri={item.url} />
    }

    if (item.mimeType.includes('audio')) {
        return <AudioMessageFlatListItem uri={item.url} />
    }

    return <DocumentMessageFlatListItem uri={item.url} type={item.mimeType} />
}

export default AttachmentMessageFlatListItems