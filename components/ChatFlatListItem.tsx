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

const ChatFlatListItem = ({ item }: { item: Chat }) => {
    const { user } = useAppSelector(state => state.user)
    const [lastMessage, setLastMessage] = useState('')
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon

    if (item.type === 'single') {
        const [otherUser, setOtherUser] = useState<User | undefined>(undefined)

        const fetchOtherUser = async () => {
            try {
                const filtered = item.participants.filter(id => id !== user?._id)
                const response = await getUserById(filtered[0] as string)

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
        }, [])

        return (
            <Pressable style={styles.container} onPress={() => router.push({
                pathname: '/(chat)',
                params: {
                    id: item._id,
                    type: item.type,
                    chatName: otherUser?.displayName,
                    photoUrl: otherUser?.photoURL
                }
            })}>
                <Image
                    source={otherUser?.photoURL.length === 0 ? require('@/assets/images/avatar.png') : { uri: otherUser?.photoURL }}
                    style={styles.image}
                />
                <View>
                    <ThemedText>{otherUser?.displayName}</ThemedText>
                    <Text style={{ color: textColor }}>{lastMessage}</Text>
                </View>
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
    }
})