import { ActivityIndicator, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import useGradualAnimation from '@/hooks/useGradualAnimation'
import { PADDING_BOTTOM } from '@/constants/Dimensions'
import Message from '@/models/Message.model'
import { useAppSelector } from '@/hooks/useAppSelector'
import MessageFlatListItem from '@/components/MessageFlatListItem'
import socket from '@/api/socket'
import { AxiosError } from 'axios'
import { getMessages } from '@/api/messageApi'

const Chat = () => {
    const limit = 10
    const { id, type, chatName, photoUrl } = useLocalSearchParams()
    const { user } = useAppSelector(state => state.user)
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState({
        text: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const navigation = useNavigation()
    const headerHeight = useHeaderHeight()
    const colorScheme = useColorScheme()
    const { height } = useGradualAnimation()
    const flatListRef = useRef<FlatList>(null)
    const fakeView = useAnimatedStyle(() => {
        return {
            height: Math.abs(height.value),
            marginBottom: height.value > 0 ? 0 : PADDING_BOTTOM
        }
    })
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text

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
            setMessage({ text: '' })
        }
    }

    const fetchMessagesOnEndReached = async () => {
        setIsLoading(true)

        const skip = page * limit

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
        socket.on('chat:messageAdded', (payload) => {
            setMessages(prev => [payload, ...prev])
        })

        return () => {
            socket.emit('chat:leaveRoom', id)
            socket.off('chat:messageAdded')
        }
    }, [])

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
                onEndReached={fetchMessagesOnEndReached}
                onEndReachedThreshold={0.5}
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
                <TouchableOpacity style={styles.sendBtn} onPress={handleOnPressSend}>
                    <Ionicons
                        name='send'
                        color={textColor}
                        size={18}
                    />
                </TouchableOpacity>
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
        justifyContent: 'space-between'
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
    }
})