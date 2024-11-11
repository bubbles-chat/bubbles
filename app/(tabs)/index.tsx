import { FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { ThemedText } from '@/components/ThemedText'
import CustomModal from '@/components/CustomModal'
import CustomButton from '@/components/CustomButton'
import { AxiosError } from 'axios'
import messaging from '@react-native-firebase/messaging'
import { addToken } from '@/api/notificationTokenApi'
import * as Notification from 'expo-notifications'
import { useAppSelector } from '@/hooks/useAppSelector'
import Chat from '@/models/Chat.model'
import ChatListEmptyComponent from '@/components/ChatListEmptyComponent'
import ChatFlatListItem from '@/components/ChatFlatListItem'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { PADDING_HORIZONTAL, PADDING_TOP, TAB_BAR_HEIGHT } from '@/constants/Dimensions'
import { useThemeColor } from '@/hooks/useThemeColor'
import CustomTextInput from '@/components/CustomTextInput'
import { InputState } from '@/types/types'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { createGroupChatAsync, getUserByEmailAsync } from '@/store/userAsyncThunks'
import { isChatArray, isUser } from '@/utils/typeChecker'
import socket from '@/api/socket'
import { ChatUserAddedPayload, ChatUserRemovedPayload, ChatUserRoleChangedPayload, UserAddedToChatPayload } from '@/types/socketPayload.type'
import { addChat, removeChat } from '@/store/userSlice'

const Home = () => {
  const { user } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const [chats, setChats] = useState<Chat[]>(user?.chats as Chat[])
  const [notificationModalVisible, setNotificationModalVisible] = useState(false)
  const [newChatModalVisible, setNewChatModalVisible] = useState(false)
  const [newChatName, setNewChatName] = useState<InputState>({
    isFocused: false,
    value: ''
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [permission, requestPermission] = Notification.usePermissions()
  const headerHeight = useHeaderHeight()
  const textColor = useThemeColor({}, 'text') as string
  const buttonBackground = useThemeColor({}, 'buttonBackground') as string

  const handleDeclineOnPress = () => {
    setNotificationModalVisible(false)
  }

  const handleAcceptOnPress = async () => {
    try {
      const requestResult = await requestPermission()

      if (requestResult.granted) {
        if (Platform.OS === 'android') {
          await Notification.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notification.AndroidImportance.MAX
          })
        }

        await messaging().registerDeviceForRemoteMessages()

        const token = await messaging().getToken()
        console.log('notification token:', token);

        await addToken(token)
      }

      setNotificationModalVisible(false)
    } catch (e) {
      const err = e as AxiosError
      console.error(err.response?.data);
    }
  }

  const handleOnPressAdd = () => {
    setNewChatModalVisible(true)
  }

  const onRequestCloseNewChatModal = () => {
    setNewChatModalVisible(false)
  }

  const onChangeText = (text: string) => {
    setNewChatName(prev => ({
      ...prev,
      value: text
    }))
  }

  const onPressCreate = () => {
    dispatch(createGroupChatAsync({ chatName: newChatName.value }))
    setNewChatModalVisible(false)
  }

  const onRefresh = () => {
    setIsRefreshing(true)
    dispatch(getUserByEmailAsync({ email: user?.email ?? '' }))
    setIsRefreshing(false)
  }

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (permission && !permission?.granted && permission?.canAskAgain) {
        setNotificationModalVisible(true)
      }
    }

    requestNotificationPermission()
  }, [permission])

  useEffect(() => {
    const chatUserAddedListener = (payload: ChatUserAddedPayload) => {
        setChats(prev => prev.map(chat => {
          if (chat._id === payload.chatId) {
            return { ...chat, participants: [...chat.participants, payload.participant] }
          }
          return chat
        }))
    }
    const chatUserRemovedListener = (payload: ChatUserRemovedPayload) => {
      if (payload.userId === user?._id) {
        dispatch(removeChat(payload.chatId))
      } else {
        setChats(prev => prev.map(chat => {
          if (payload.chatId === chat._id) {
            return {
              ...chat,
              participants: chat.participants.filter(participant => {
                if (isUser(participant.user)) {
                  return participant.user._id !== payload.userId
                }
                return false
              })
            }
          }
          return chat
        }))
      }
    }
    const chatUserRoleChangedListener = (payload: ChatUserRoleChangedPayload) => {
      setChats(prev => prev.map(chat => {
        if (chat._id === payload.chatId) {
          return {
            ...chat,
            participants: chat.participants.map(participant => {
              if ((isUser(participant.user) && participant.user._id === payload.userId) || participant.user === payload.userId) {
                return { ...participant, isAdmin: true }
              }
              return participant
            })
          }
        }
        return chat
      }))
    }
    const userAddedToChatListener = (payload: UserAddedToChatPayload) => {
      dispatch(addChat(payload.chat))
    }

    socket.on("chat:userAdded", chatUserAddedListener)
    socket.on("chat:userRemoved", chatUserRemovedListener)
    socket.on("chat:userRoleChanged", chatUserRoleChangedListener)
    socket.on("user:addedToChat", userAddedToChatListener)

    return () => {
      socket.off('chat:userAdded', chatUserAddedListener)
      socket.off('chat:userRemoved', chatUserRemovedListener)
      socket.off('chat:userRoleChanged', chatUserRoleChangedListener)
      socket.off('user:addedToChat', userAddedToChatListener)
    }
  }, [])

  useEffect(() => {
    if (user?.chats && isChatArray(user.chats)) {
      setChats(user.chats)
    }
  }, [user?.chats.length])

  return (
    <ThemedView style={[styles.contianer]}>
      {/* notification permission modal */}
      <CustomModal visible={notificationModalVisible}>
        <ThemedText style={styles.modalTitle}>Notification Permission required</ThemedText>
        <View style={{ height: 16 }} />
        <ThemedText style={{ textAlign: 'justify' }}>
          Notification permission is required so that you can be notified when a user is trying to connect to you or when someone has sent you a message.
        </ThemedText>
        <View style={{ height: 16 }} />
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <CustomButton
            text='Decline'
            onPress={handleDeclineOnPress}
            hasBackground={false}
          />
          <CustomButton
            text='Accept'
            onPress={handleAcceptOnPress}
          />
        </View>
      </CustomModal>
      {/* new chat modal */}
      <CustomModal visible={newChatModalVisible} onRequestClose={onRequestCloseNewChatModal}>
        <ThemedText style={styles.modalTitle}>Create new chat</ThemedText>
        <View style={styles.separator} />
        <CustomTextInput
          state={newChatName}
          placeholder='Chat name'
          Icon={<AntDesign
            name='edit'
            color={textColor}
            size={18}
          />}
          onChangeText={onChangeText}
        />
        <View style={styles.separator} />
        <View style={styles.rowView}>
          <CustomButton
            text='Cancel'
            hasBackground={false}
            onPress={onRequestCloseNewChatModal}
          />
          <CustomButton
            text='Create'
            onPress={onPressCreate}
          />
        </View>
      </CustomModal>
      {(user && isChatArray(chats)) && <FlatList
        data={chats}
        renderItem={({ item }) => <ChatFlatListItem item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContainer}
        ListHeaderComponent={<View style={{ height: headerHeight }} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      />}
      {!user?.chats.length && <ChatListEmptyComponent />}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: buttonBackground }]}
        onPress={handleOnPressAdd}
      >
        <Ionicons
          name='add'
          color={textColor}
          size={50}
        />
      </TouchableOpacity>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    paddingHorizontal: 8
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'flex-start'
  },
  flatListContainer: {
    flexGrow: 1
  },
  addBtn: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT + PADDING_TOP,
    right: PADDING_HORIZONTAL,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    elevation: 5
  },
  separator: {
    height: 8
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
})