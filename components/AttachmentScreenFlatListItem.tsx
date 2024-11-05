import ImageAttachmentScreenFlatListItem from './ImageAttachmentScreenFlatListItem'
import VideoAttachmentScreenFlatListItem from './VideoAttachmentScreenFlatListItem'
import AudioAttachmentScreenFlatListItem from './AudioAttachmentScreenFlatListItem'
import DocumentAttachmentScreenFlatListItem from './DocumentAttachmentScreenFlatListItem'
import { AttachmentScreenFlatListItemProps } from '@/types/types'

const AttachmentScreenFlatListItem = ({ mimeType, name, uri }: AttachmentScreenFlatListItemProps) => {
    if (mimeType?.startsWith('image/')) {
        return <ImageAttachmentScreenFlatListItem mimeType={mimeType} name={name} uri={uri} />
    }

    if (mimeType?.startsWith('video/')) {
        return <VideoAttachmentScreenFlatListItem mimeType={mimeType} name={name} uri={uri} />
    }

    if (mimeType?.startsWith('audio/')) {
        return <AudioAttachmentScreenFlatListItem mimeType={mimeType} name={name} uri={uri} />
    }

    return <DocumentAttachmentScreenFlatListItem mimeType={mimeType} name={name} uri={uri} />
}

export default AttachmentScreenFlatListItem