import { FlatList, Modal, Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import Participant from '@/models/Participant.model'
import { ThemedText } from '@/components/ThemedText'
import { useHeaderHeight } from '@react-navigation/elements'
import { PADDING_HORIZONTAL, PADDING_TOP } from '@/constants/Dimensions'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import ParticipantFlatListItem from '@/components/ParticipantFlatListItem'
import { isUser, isUserArray } from '@/utils/typeChecker'
import { useAppSelector } from '@/hooks/useAppSelector'
import CustomTextInput from '@/components/CustomTextInput'
import { InputState } from '@/types/types'
import User from '@/models/User.model'
import UserFlatListItem from '@/components/UserFlatListItem'
import BlurViewContainer from '@/components/BlurViewContainer'
import { AxiosError } from 'axios'
import showToast from '@/components/Toast'
import { addUserToGroupChat, makeParticipantAnAdmin, removeParticipantFromGroupChat } from '@/api/chatApi'
import socket from '@/api/socket'
import { ChatUserAddedPayload, ChatUserRemovedPayload, ChatUserRoleChangedPayload } from '@/types/socketPayload.type'
import AddParticipantListEmptyComponent from '@/components/AddParticipantListEmptyComponent'

const Participants = () => {
    const { user } = useAppSelector(state => state.user)
    const { id, participants }: { id: string, participants: string } = useLocalSearchParams()
    const headerHeight = useHeaderHeight()
    const [users, setUsers] = useState<Participant[]>(JSON.parse(participants))
    const [modalVisible, setModalVisible] = useState(false)
    const [isCurrentUserAnAdmin, setIsCurrentUserAnAdmin] = useState(false)
    const [search, setSearch] = useState<InputState>({
        isFocused: false,
        value: ''
    })
    const [connections, setConnections] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const colorScheme = useColorScheme()
    const textColor = useThemeColor({}, 'text') as string

    const onPressAddParticipant = () => {
        setModalVisible(true)
    }

    const onRequestClose = () => {
        setModalVisible(false)
    }

    const onChangeText = (text: string) => {
        setSearch(prev => ({
            ...prev,
            value: text
        }))
        setFilteredUsers(connections.filter(user => user.displayName.toLowerCase().includes(text.toLowerCase())))
    }

    const onPressAdd = async (userId: string) => {
        try {
            await addUserToGroupChat(id, userId)
            showToast('User added successfully')
        } catch (e) {
            const err = e as AxiosError
            console.log('Participants:onPressAdd:', err.response?.data)
            showToast("Couldn't add user to group chat.")
        }
    }

    const onPressYesRemove = async (user: User | string) => {
        if (isUser(user)) {
            try {
                const response = await removeParticipantFromGroupChat(id, user._id)

                if (response.status === 200) {
                    showToast('User removed successfully')
                }
            } catch (e) {
                const err = e as AxiosError
                console.log('participants:onPressRemove:', err.response?.data)
                showToast("Couldn't remove user")
            }
        }
    }

    const onPressMakeAnAdmin = async (user: User | string) => {
        if (isUser(user)) {
            try {
                const response = await makeParticipantAnAdmin(id, user._id)

                if (response.status === 200) {
                    showToast('User role changed')
                }
            } catch (e) {
                const err = e as AxiosError
                console.log('participants:onPressMakeAnAdmin:', err.response?.data)
                showToast("Couldn't change user role")
            }
        }
    }

    useEffect(() => {
        const checkIfAdmin = () => {
            const currentParticipant = users.filter(participant => {
                if (isUser(participant.user)) {
                    return participant.user._id === user?._id
                }

                return false
            })

            if (currentParticipant.length > 0) {
                setIsCurrentUserAnAdmin(currentParticipant[0].isAdmin ?? false)
            }
        }
        const chatUserAddedListener = (payload: ChatUserAddedPayload) => {
            const pUser = payload.participant.user
            if (payload.chatId === id && isUser(pUser)) {
                setUsers(prev => [...prev, payload.participant])
                setConnections(prev => prev.filter(user => user._id !== pUser._id))
            }
        }
        const chatUserRemovedListener = (payload: ChatUserRemovedPayload) => {
            if (payload.chatId === id) {
                setUsers(prev => prev.filter(user => {
                    if (isUser(user.user)) {
                        return user.user._id !== payload.userId
                    }
                    return false
                }))
            }
        }
        const chatUserRoleChangedListener = (payload: ChatUserRoleChangedPayload) => {
            if (payload.chatId === id) {
                setUsers(prev => prev.map(user => {
                    if ((isUser(user.user) && user.user._id === payload.userId) || user.user === payload.userId) {
                        return { ...user, isAdmin: true }
                    }
                    return user
                }))
            }
        }

        checkIfAdmin()

        socket.on('chat:userAdded', chatUserAddedListener)
        socket.on("chat:userRemoved", chatUserRemovedListener)
        socket.on('chat:userRoleChanged', chatUserRoleChangedListener)

        return () => {
            socket.off('chat:userAdded', chatUserAddedListener)
            socket.off('chat:userRemoved', chatUserRemovedListener)
            socket.off('chat:userRoleChanged', chatUserRoleChangedListener)
        }
    }, [])

    useEffect(() => {
        const filterConnections = () => {
            const userIds = users.map(user => {
                if (isUser(user.user)) {
                    return user.user._id
                }
                return undefined
            })

            if (user?.connections && isUserArray(user.connections)) {
                setConnections(user.connections.filter(user => !userIds.includes(user._id)))
            }
        }

        filterConnections()
    }, [users.length])

    return (
        <ThemedView style={styles.container}>
            <Modal
                visible={modalVisible}
                onRequestClose={onRequestClose}
                animationType='slide'
            >
                <BlurViewContainer enabled={true}>
                    <View style={{ paddingTop: PADDING_TOP, paddingHorizontal: PADDING_HORIZONTAL, flex: 1 }}>
                        <CustomTextInput
                            state={search}
                            placeholder='Search your connections'
                            Icon={<Ionicons
                                name='search'
                                color={textColor}
                                size={18}
                            />}
                            onChangeText={onChangeText}
                        />
                        <FlatList
                            data={search.value.length > 0 ? filteredUsers : connections}
                            renderItem={({ item }) => <UserFlatListItem item={item} onPressAdd={async () => await onPressAdd(item._id)} />}
                            keyExtractor={(item) => item._id}
                            ListEmptyComponent={<AddParticipantListEmptyComponent />}
                            contentContainerStyle={styles.flatListContainer}
                        />
                    </View>
                </BlurViewContainer>
            </Modal>
            <FlatList
                data={users}
                renderItem={({ item }) => <ParticipantFlatListItem
                    item={item}
                    showOptionsBtn={isCurrentUserAnAdmin}
                    onPressYesRemove={async () => await onPressYesRemove(item.user)}
                    onPressMakeAnAdmin={async () => await onPressMakeAnAdmin(item.user)}
                />}
                ListHeaderComponent={<>
                    <View style={{ height: headerHeight + PADDING_TOP }} />
                    {isCurrentUserAnAdmin && <Pressable style={styles.addParticipantBtn} onPress={onPressAddParticipant}>
                        <View style={[styles.addParticipantView, { backgroundColor: colorScheme === 'dark' ? '#343434' : '#d3d3d3' }]}>
                            <Ionicons
                                name='person-add'
                                color={textColor}
                                size={20}
                            />
                        </View>
                        <ThemedText>Add participant</ThemedText>
                    </Pressable>}
                </>}
                contentContainerStyle={styles.flatListContainer}
            />
        </ThemedView>
    )
}

export default Participants

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8
    },
    addParticipantBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8
    },
    addParticipantView: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flatListContainer: {
        flex: 1
    }
})