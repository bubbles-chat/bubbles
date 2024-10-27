import { ActivityIndicator, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { Feather, Ionicons } from '@expo/vector-icons'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import useGradualAnimation from '@/hooks/useGradualAnimation'
import { PADDING_BOTTOM } from '@/constants/Dimensions'
import Message from '@/models/Message.model'
import { useAppSelector } from '@/hooks/useAppSelector'
import MessageFlatListItem from '@/components/MessageFlatListItem'
import socket from '@/api/socket'
import { AxiosError } from 'axios'
import { getMessages } from '@/api/messageApi'
import * as DocumentPicker from 'expo-document-picker'
import AttachmentPreviewFlatListItem from '@/components/AttachmentPreviewFlatListItem'

const Chat = () => {
    const limit = 20
    const { id, type, chatName, photoUrl } = useLocalSearchParams()
    const { user } = useAppSelector(state => state.user)

    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState<{ text: string, attachments: { uri: string, type: string, name: string }[] }>({
        text: '',
        attachments: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [isNearBottom, setIsNearBottom] = useState(true)
    const [counter, setCounter] = useState(0)

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

    const handleOnChangeText = (text: string) => {
        setMessage(prev => ({
            ...prev,
            text
        }))
    }

    const handleOnPressSend = () => {
        if (message.text.length > 0) {
            const payload: Message = {
                chatId: id as string,
                sender: user?._id as string,
                attachmentsUrl: [],
                text: message.text
            }
            socket.emit('chat:newMessage', payload)
            setMessage({ text: '', attachments: [] })
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
        const result = await DocumentPicker.getDocumentAsync({
            multiple: true
        })

        if (!result.canceled) {
            setMessage(prev => ({
                ...prev,
                attachments: [...prev.attachments, ...result.assets.map(asset => ({
                    uri: asset.uri,
                    type: asset.mimeType as string,
                    name: asset.name
                }))]
            }))
        }
    }

    const handleOnPressRemove = (uri: string) => {
        setMessage(prev => ({
            ...prev,
            attachments: prev.attachments.filter(attachment => attachment.uri !== uri)
        }))
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
                    source={photoUrl.length === 0 ? require('@/assets/images/avatar.png') : { uri: photoUrl }}
                    style={styles.image}
                />
                <ThemedText>{chatName}</ThemedText>
            </>
        })

        socket.emit('chat:joinRoom', id)
        socket.on('chat:messageAdded', (payload: { chatId: string, message: Message }) => {
            if (payload.chatId === id) {
                setMessages(prev => [payload.message, ...prev])
                setCounter(prev => prev + 1)
            }
        })
        socket.on('chat:messageDeleted', (payload: string) => {
            setMessages(prev => prev.filter(message => message._id !== payload))
            setCounter(prev => prev > 0 ? prev - 1 : prev)
        })
        socket.on('chat:messageEdited', (payload: { text: string, id: string }) => {
            setMessages(prev => prev.map(message => message._id === payload.id ? { ...message, text: payload.text } : message))
        })

        return () => {
            socket.emit('chat:leaveRoom', id)
            socket.off('chat:messageAdded')
            socket.off('chat:messageDeleted')
            socket.off('chat:messageEdited')
        }
    }, [])

    useEffect(() => {
        scrollToBottomOpacity.value = withTiming(isNearBottom ? 0 : 1, { duration: 300 })
    }, [isNearBottom])

    return (
        <ThemedView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <MessageFlatListItem item={item} />}
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
                    <TouchableOpacity style={styles.sendBtn} onPress={handleOnPressSend}>
                        <Ionicons
                            name='send'
                            color={textColor}
                            size={18}
                        />
                    </TouchableOpacity>
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
        elevation: 4
    },
    scrollToBottomBtn: {
        padding: 8
    },
    previewFlatList: {
        gap: 8
    }
})