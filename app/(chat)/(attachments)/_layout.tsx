import MaterialTopTabs from '@/components/navigation/MaterialTopTabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import * as FileSystem from 'expo-file-system'
import mime from 'mime'
import { AttachmentsProvider, useAttachments } from '@/context/AttachmentsContext'
import { StatusBar } from 'expo-status-bar'
import { useThemeColor } from '@/hooks/useThemeColor'

const Layout = () => {
    const { chatId } = useLocalSearchParams()
    const chatPath = `${FileSystem.documentDirectory}/${chatId}`
    const headerHeight = useHeaderHeight()
    const background = useThemeColor({}, 'background') as string
    const activeTintColor = useThemeColor({}, 'tabIconSelected') as string
    const inactiveTintColor = useThemeColor({}, 'tabIconDefault') as string
    const indicatorColor = useThemeColor({}, 'buttonBackground') as string
    const { setAllAttachments, setAudioAttachments, setOtherAttachments, setPhotoAttachments, setVideoAttachments } = useAttachments()

    const loadAttachments = async () => {
        if ((await FileSystem.getInfoAsync(chatPath)).exists) {
            const files = await FileSystem.readDirectoryAsync(chatPath)

            files.forEach(async file => {
                const mimeType = mime.getType(file) as string
                const info = await FileSystem.getInfoAsync(`${chatPath}/${file}`)

                setAllAttachments(prev => [...prev, { mimeType, uri: info.uri, name: file }])

                if (mimeType?.startsWith('image/')) {
                    setPhotoAttachments(prev => [...prev, { mimeType, uri: info.uri, name: file }])
                } else if (mimeType?.startsWith('video/')) {
                    setVideoAttachments(prev => [...prev, { mimeType, uri: info.uri, name: file }])
                } else if (mimeType?.startsWith('audio/')) {
                    setAudioAttachments(prev => [...prev, { mimeType, uri: info.uri, name: file }])
                } else {
                    setOtherAttachments(prev => [...prev, { mimeType, uri: info.uri, name: file }])
                }
            })
        }
    }

    useEffect(() => {
        loadAttachments()
    }, [])

    return (
        <>
            <MaterialTopTabs
                screenOptions={{
                    tabBarStyle: {
                        top: headerHeight,
                        backgroundColor: background,
                        position: 'absolute',
                        height: 50,
                        width: '100%',
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                        overflow: 'hidden'
                    },
                    tabBarActiveTintColor: activeTintColor,
                    tabBarInactiveTintColor: inactiveTintColor,
                    tabBarIndicatorStyle: {
                        backgroundColor: indicatorColor,
                        height: 4
                    },
                    tabBarLabelStyle: {
                        textTransform: 'capitalize'
                    }
                }}
            >
                <MaterialTopTabs.Screen name='index' options={{ title: "All" }} />
                <MaterialTopTabs.Screen name='photos' />
                <MaterialTopTabs.Screen name='videos' />
                <MaterialTopTabs.Screen name='audio' />
                <MaterialTopTabs.Screen name='other' />
            </MaterialTopTabs>
            <StatusBar backgroundColor='transparent' />
        </>
    )
}

const AttachmentsLayout = () => {
    return (
        <AttachmentsProvider>
            <Layout />
        </AttachmentsProvider>
    )
}

export default AttachmentsLayout