import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { useEffect, useState } from 'react'
import Chat from '@/models/Chat.model'
import { AxiosError } from 'axios'
import { getUserById } from '@/api/userApi'
import { useAppSelector } from '@/hooks/useAppSelector'
import User from '@/models/User.model'
import { ThemedText } from './ThemedText'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { getMessage } from '@/api/messageApi'
import socket from '@/api/socket'
import Message from '@/models/Message.model'

const ChatFlatListItem = ({ item }: { item: Chat }) => {
    const { user } = useAppSelector(state => state.user)
    const [lastMessage, setLastMessage] = useState('')
    const [counter, setCounter] = useState(0)
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon
    const tintColor = colorScheme === 'dark' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected

    if (item.type === 'single') {
        const [otherUser, setOtherUser] = useState<User | undefined>(undefined)

        const fetchOtherUser = async () => {
            try {
                const filtered = item.participants.filter(participant => participant.user !== user?._id)
                const response = await getUserById(filtered[0].user.toString())

                if (response.status === 200) {
                    setOtherUser(response.data.user)
                }
            } catch (e) {
                const err = e as AxiosError
                console.log('ChatListItem:fetchOtherUser:', err.response?.data);
            }
        }

        const fetchLastMessage = async () => {
            try {
                if (item.lastMessage) {
                    const response = await getMessage(item.lastMessage as string)

                    if (response.status === 200) {
                        setLastMessage(response.data.message.text)
                    }
                }
            } catch (e) {
                const err = e as AxiosError
                console.log('ChatListItem:fetchLastMessage:', err.response?.data);
            }
        }

        useEffect(() => {
            fetchOtherUser()
            fetchLastMessage()

            socket.emit('chat:joinRoom', item._id)
            socket.on('chat:messageAdded', (payload: { chatId: string, message: Message }) => {
                if (payload.chatId === item._id) {
                    setLastMessage(payload.message.text)
                    setCounter(prev => prev + 1)
                }
            })

            return () => {
                socket.emit('chat:leaveRoom', item._id)
                socket.off('chat:messageAdded')
            }
        }, [])

        return (
            <Pressable style={styles.container} onPress={() => {
                router.push({
                    pathname: '/(chat)',
                    params: {
                        id: item._id,
                        type: item.type,
                        chatName: otherUser?.displayName,
                        photoUrl: otherUser?.photoURL
                    }
                })
                setCounter(0)
            }}>
                <Image
                    source={otherUser?.photoURL.length === 0 ? require('@/assets/images/avatar.png') : { uri: otherUser?.photoURL }}
                    style={styles.image}
                />
                <View>
                    <ThemedText>{otherUser?.displayName}</ThemedText>
                    <Text style={{ color: textColor }} numberOfLines={1}>{lastMessage}</Text>
                </View>
                {counter > 0 && <View style={[styles.counterView, { backgroundColor: tintColor }]}>
                    <Text style={{ color: colorScheme === 'dark' ? '#000' : '#fff' }}>{counter}</Text>
                </View>}
            </Pressable>
        )
    } else {
        return (
            <Pressable style={styles.container}>

            </Pressable>
        )
    }

}

export default ChatFlatListItem

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 8,
        backgroundColor: 'lightgrey'
    },
    counterView: {
        padding: 4,
        position: 'absolute',
        right: 8,
        borderRadius: 16
    }
})