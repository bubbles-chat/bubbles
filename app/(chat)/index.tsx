import { ActivityIndicator, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { Entypo, Feather, Ionicons } from '@expo/vector-icons'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import useGradualAnimation from '@/hooks/useGradualAnimation'
import { PADDING_BOTTOM } from '@/constants/Dimensions'
import Message from '@/models/Message.model'
import { useAppSelector } from '@/hooks/useAppSelector'
import MessageFlatListItem from '@/components/MessageFlatListItem'
import socket from '@/api/socket'
import { AxiosError } from 'axios'
import { getMessages, uploadAttachment } from '@/api/messageApi'
import * as DocumentPicker from 'expo-document-picker'
import AttachmentPreviewFlatListItem from '@/components/AttachmentPreviewFlatListItem'
import * as MediaLibrary from 'expo-media-library'
import showToast from '@/components/Toast'
import AttachmentUrl from '@/models/AttachmentUrl.model'
import ChatOptionsModal from '@/components/ChatOptionsModal'
import Participant from '@/models/Participant.model'
import { isUser } from '@/utils/typeChecker'
import { ChatMessageAddedPayload, ChatMessageEditedPayload, ChatUserAddedPayload, ChatUserRemovedPayload, ChatUserRoleChangedPayload } from '@/types/socketPayload.type'

const Chat = () => {
    const limit = 20
    const { id, type, chatName, photoUrl } = useLocalSearchParams()
    let { participants } = useLocalSearchParams()
    const { user } = useAppSelector(state => state.user)
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions()

    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState<{ text: string, attachments: DocumentPicker.DocumentPickerAsset[] }>({
        text: '',
        attachments: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [isNearBottom, setIsNearBottom] = useState(true)
    const [counter, setCounter] = useState(0)
    const [isSending, setIsSending] = useState(false)
    const [optionsModalVisible, setOptionsModalVisible] = useState(false)

    const navigation = useNavigation()
    const headerHeight = useHeaderHeight()
    const colorScheme = useColorScheme()
    const { height } = useGradualAnimation()
    const scrollToBottomOpacity = useSharedValue(0)

    const flatListRef = useRef<FlatList>(null)

    const fakeView = useAnimatedStyle(() => {
        return {
            height: Math.abs(height.value),
            marginBottom: height.value > 0 ? 0 : PADDING_BOTTOM
        }
    })
    const scollToBottomBtn = useAnimatedStyle(() => {
        return {
            bottom: Math.abs(height.value) + 70,
            opacity: scrollToBottomOpacity.value
        }
    })

    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
    const bubbleBackground = colorScheme === 'dark' ? '#343434' : '#d3d3d3'
    const [options, setOptions] = useState([
        <Pressable key={1} style={styles.chatOptionsBtns} onPress={() => onPressOption(() => router.push({
            pathname: '/(chat)/(attachments)',
            params: {
                chatId: id
            }
        }))}>
            <ThemedText>Saved attachments</ThemedText>
        </Pressable>
    ])

    const onPressOption = (callback: () => void) => {
        setOptionsModalVisible(false)
        callback()
    }

    const handleOnChangeText = (text: string) => {
        setMessage(prev => ({
            ...prev,
            text
        }))
    }

    const handleOnPressSend = async () => {
        setIsSending(true)
        try {
            if (message.text.length > 0 || message.attachments.length > 0) {
                const responses = await Promise.all(message.attachments.map(async attachment => {
                    const formData = new FormData()

                    formData.append('file', {
                        uri: attachment.uri as string,
                        name: attachment.name as string,
                        type: attachment.mimeType as string
                    } as any)

                    return await uploadAttachment(formData, id as string)
                }))

                const results: AttachmentUrl[] = responses.map((response, index) => {
                    return {
                        url: response.data.data?.url as string,
                        mimeType: message.attachments[index].mimeType as string,
                        name: message.attachments[index].name,
                        publicId: response.data.data?.public_id as string
                    }
                })
                const payload: Message = {
                    chatId: id as string,
                    sender: user?._id as string,
                    attachmentsUrl: results as AttachmentUrl[],
                    text: message.text
                }
                socket.emit('chat:newMessage', payload)
                setMessage({ text: '', attachments: [] })
            }
        } catch (e) {
            const err = e as AxiosError
            console.log('handleOnPressSend:', err.response?.data);
            showToast("Couldn't send message")
        } finally {
            setIsSending(false)
        }
    }

    const handleOnPressScrollToBottom = () => {
        flatListRef.current?.scrollToIndex({ animated: true, index: 0 })
    }

    const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const yOffset = event.nativeEvent.contentOffset.y
        setIsNearBottom(yOffset < 200)
    }

    const handleOnPressAttach = async () => {
        const onPermissionGranted = async () => {
            const result = await DocumentPicker.getDocumentAsync({
                multiple: true
            })

            if (!result.canceled) {
                setMessage(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, ...result.assets.map(asset => asset)]
                }))
            }
        }

        if (mediaPermission?.granted) {
            await onPermissionGranted()
        } else {
            const result = await requestMediaPermission()

            if (result.granted) {
                await onPermissionGranted()
            }
        }
    }

    const handleOnPressRemove = (uri: string) => {
        setMessage(prev => ({
            ...prev,
            attachments: prev.attachments.filter(attachment => attachment.uri !== uri)
        }))
    }

    const handleOnPressOptions = () => {
        setOptionsModalVisible(true)
    }

    const onRequestCloseOptionsModal = () => {
        setOptionsModalVisible(false)
    }

    const fetchMessagesOnEndReached = async () => {
        setIsLoading(true)

        const skip = page * limit + counter

        try {
            if (hasMore) {
                const response = await getMessages(id as string, limit, skip)

                if (response.status === 200) {
                    const { messages } = response.data

                    if (messages.length < limit) {
                        setHasMore(false)
                    }

                    setMessages(prev => [...prev, ...messages])
                    setPage(prev => prev + 1)
                }
            }
        } catch (e) {
            const err = e as AxiosError
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <>
                <Image
                    source={photoUrl.length === 0 ?
                        type === 'single' ?
                            require('@/assets/images/avatar.png') : require('@/assets/images/group-avatar.png')
                        : { uri: photoUrl }}
                    style={styles.image}
                />
                <ThemedText>{chatName}</ThemedText>
            </>,
            headerRight: () => (
                <Pressable style={styles.optionsBtn} onPress={handleOnPressOptions}>
                    <Entypo
                        name='dots-three-vertical'
                        color={textColor}
                        size={20}
                    />
                </Pressable>
            )
        })

        if (type === 'group') {
            setOptions(prev => [
                ...prev,
                <Pressable key={2} style={styles.chatOptionsBtns} onPress={() => onPressOption(() => router.push({
                    pathname: '/(chat)/participants',
                    params: {
                        id,
                        participants
                    }
                }))}>
                    <ThemedText>participants</ThemedText>
                </Pressable>,
                <Pressable key={3} style={styles.chatOptionsBtns}>
                    <ThemedText style={{ color: 'red' }}>Leave chat</ThemedText>
                </Pressable>
            ])
        }
    }, [])

    useEffect(() => {
        scrollToBottomOpacity.value = withTiming(isNearBottom ? 0 : 1, { duration: 300 })
    }, [isNearBottom])

    useEffect(() => {
        const chatMessageAddedListener = (payload: ChatMessageAddedPayload) => {
            if (payload.chatId === id) {
                setMessages(prev => [payload.message, ...prev])
                setCounter(prev => prev + 1)
            }
        }
        const chatMessageDeletedListener = (payload: string) => {
            setMessages(prev => prev.filter(message => message._id !== payload))
            setCounter(prev => prev > 0 ? prev - 1 : prev)
        }
        const chatMessageEditedListener = (payload: ChatMessageEditedPayload) => {
            setMessages(prev => prev.map(message => message._id === payload.id ? { ...message, text: payload.text } : message))
        }
        const chatUserAddedListener = (payload: ChatUserAddedPayload) => {
            if (payload.chatId === id) {
                const parts = JSON.parse(participants as string) as Participant[]
                parts.push(payload.participant)
                participants = JSON.stringify(parts)
            }
        }
        const chatUserRemovedListener = (payload: ChatUserRemovedPayload) => {
            if (payload.chatId === id) {
                const parts = JSON.parse(participants as string) as Participant[]
                participants = JSON.stringify(parts.filter(participant => {
                    if (isUser(participant.user)) {
                        return participant.user._id !== payload.userId
                    }
                    return false
                }))
            }
        }
        const chatUserRoleChangedListener = (payload: ChatUserRoleChangedPayload) => {
            if (payload.chatId === id) {
                const parts = JSON.parse(participants as string) as Participant[]

                for (let i = 0; i < parts.length; i++) {
                    const user = parts[i].user
                    if (isUser(user) && user._id === payload.userId) {
                        parts[i] = { ...parts[i], isAdmin: true }
                    }
                }
                participants = JSON.stringify(parts)
            }
        }

        socket.emit('chat:joinRoom', id)
        socket.on('chat:messageAdded', chatMessageAddedListener)
        socket.on('chat:messageDeleted', chatMessageDeletedListener)
        socket.on('chat:messageEdited', chatMessageEditedListener)
        socket.on('chat:userAdded', chatUserAddedListener)
        socket.on('chat:userRemoved', chatUserRemovedListener)
        socket.on('chat:userRoleChanged', chatUserRoleChangedListener)

        return () => {
            socket.off('chat:messageAdded', chatMessageAddedListener)
            socket.off('chat:messageDeleted', chatMessageDeletedListener)
            socket.off('chat:messageEdited', chatMessageEditedListener)
            socket.off('chat:userAdded', chatUserAddedListener)
            socket.off('chat:userRemoved', chatUserRemovedListener)
            socket.off('chat:userRoleChanged', chatUserRoleChangedListener)
        }
    }, [])

    return (
        <ThemedView style={styles.container}>
            <ChatOptionsModal
                visible={optionsModalVisible}
                onRequestClose={onRequestCloseOptionsModal}
                options={options}
            />
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <MessageFlatListItem item={item} />}
                keyExtractor={(item, index) => item._id ?? index.toString()}
                ListFooterComponent={isLoading ?
                    <>
                        <View style={{ height: headerHeight }} />
                        <ActivityIndicator size='large' />
                    </> : <View style={{ height: headerHeight }} />}
                inverted
                contentContainerStyle={styles.flatListContainer}
                onEndReached={async () => {
                    if (!isLoading) {
                        await fetchMessagesOnEndReached()
                    }
                }}
                onEndReachedThreshold={0.5}
                onScroll={handleOnScroll}
            />
            <Animated.View style={[styles.scrollToBottomBtnView, scollToBottomBtn, { backgroundColor: bubbleBackground }]}>
                <TouchableOpacity style={styles.scrollToBottomBtn} onPress={handleOnPressScrollToBottom}>
                    <Feather
                        name='chevron-down'
                        size={18}
                        color={textColor}
                    />
                </TouchableOpacity>
            </Animated.View>
            <View style={{ gap: 8 }}>
                <FlatList
                    data={message.attachments}
                    renderItem={({ item }) => <AttachmentPreviewFlatListItem item={item} onPress={() => handleOnPressRemove(item.uri)} />}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    contentContainerStyle={styles.previewFlatList}
                />
                <View style={[styles.inputView, { borderColor: textColor, }]}>
                    <TextInput
                        value={message.text}
                        placeholder='Type a message'
                        placeholderTextColor={textColor}
                        onChangeText={handleOnChangeText}
                        style={[styles.textInput, { color: textColor }]}
                        keyboardType='default'
                        multiline
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleOnPressAttach}>
                        <Ionicons
                            name='attach'
                            color={textColor}
                            size={18}
                        />
                    </TouchableOpacity>
                    {isSending ? <ActivityIndicator size={'large'} /> : <TouchableOpacity style={styles.sendBtn} onPress={handleOnPressSend}>
                        <Ionicons
                            name='send'
                            color={textColor}
                            size={18}
                        />
                    </TouchableOpacity>}
                </View>
            </View>
            <Animated.View style={fakeView} />
        </ThemedView>
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 8,
        backgroundColor: 'lightgrey'
    },
    inputView: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
    },
    textInput: {
        flex: 1
    },
    sendBtn: {
        padding: 8
    },
    flatListContainer: {
        flexGrow: 1,
        marginTop: 8,
        gap: 8
    },
    scrollToBottomBtnView: {
        position: 'absolute',
        right: 8,
        borderRadius: 10,
        elevation: 4,
        zIndex: 1
    },
    scrollToBottomBtn: {
        padding: 8
    },
    previewFlatList: {
        gap: 8
    },
    optionsBtn: {
        padding: 4
    },
    chatOptionsBtns: {
        paddingVertical: 4
    }
})