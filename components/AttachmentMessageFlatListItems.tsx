import AttachmentUrl from '@/models/AttachmentUrl.model'
import ImageMessageFlatListItem from './ImageMessageFlatListItem'
import VideoMessageFlatListItem from './VideoMessageFlatListItem'
import AudioMessageFlatListItem from './AudioMessageFlatListItem'
import DocumentMessageFlatListItem from './DocumentMessageFlatListItem'
import * as FileSystem from 'expo-file-system'
import { useEffect, useState } from 'react'
import showToast from './Toast'
import { Alert, Platform } from 'react-native'
import * as IntentLauncher from 'expo-intent-launcher'

const AttachmentMessageFlatListItems = ({ item, chatId }: { item: AttachmentUrl, chatId: string }) => {
    const [deosExist, setDeosExist] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [progress, setProgress] = useState(0)
    const path = `${FileSystem.documentDirectory}/${chatId}/${item.name}`

    const checkIfFileExists = async () => {
        const info = await FileSystem.getInfoAsync(path)
        setDeosExist(info.exists)
    }

    const downloadResumableCallback: FileSystem.FileSystemNetworkTaskProgressCallback<FileSystem.DownloadProgressData> = (downloadProgress) => {
        const progress = (Math.round(downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite)) * 100
        setProgress(progress)
    }

    const onPressDownload = async () => {
        const info = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}/${chatId}`)

        if (!info.isDirectory) {
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}/${chatId}`)
        }

        const downloadResumable = FileSystem.createDownloadResumable(
            item.url,
            path,
            {},
            downloadResumableCallback
        )
        setIsDownloading(true)

        try {
            await downloadResumable.downloadAsync()
            checkIfFileExists()
            showToast('Attachment downloaded successfully')
        } catch (e) {
            console.log('onPressDownload:', e)
        } finally {
            setIsDownloading(false)
        }
    }

    const onPressOpen = async () => {
        const contentUri = await FileSystem.getContentUriAsync(path)

        if (Platform.OS === 'android') {
            await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                data: contentUri,
                type: item.mimeType,
                flags: 1
            })
        } else {
            Alert.alert("Action not supported", "Opening files is currently supported on Android only.", [
                {
                    text: "OK",
                    style: "default"
                }
            ])
        }
    }

    useEffect(() => {
        checkIfFileExists()
    }, [])

    if (item.mimeType.includes('image')) {
        return <ImageMessageFlatListItem
            uri={deosExist ? path : item.url}
            name={item.name}
            doesExist={deosExist}
            isDownloading={isDownloading}
            progress={progress}
            onPressDownload={onPressDownload}
            onPressOpen={onPressOpen}
        />
    }

    if (item.mimeType.includes('video')) {
        return <VideoMessageFlatListItem
            uri={deosExist ? path : item.url}
            name={item.name}
            doesExist={deosExist}
            isDownloading={isDownloading}
            progress={progress}
            onPressDownload={onPressDownload}
        />
    }

    if (item.mimeType.includes('audio')) {
        return <AudioMessageFlatListItem
            uri={deosExist ? path : item.url}
            name={item.name}
            doesExist={deosExist}
            isDownloading={isDownloading}
            progress={progress}
            onPressDownload={onPressDownload}
        />
    }

    return <DocumentMessageFlatListItem
        uri={deosExist ? path : item.url}
        name={item.name}
        doesExist={deosExist}
        isDownloading={isDownloading}
        progress={progress}
        onPressDownload={onPressDownload}
        onPressOpen={onPressOpen}
    />
}

export default AttachmentMessageFlatListItems