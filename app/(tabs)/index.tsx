import { FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
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
import { createGroupChatAsync } from '@/store/userAsyncThunks'

const Home = () => {
  const { user } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const [notificationModalVisible, setNotificationModalVisible] = useState(false)
  const [newChatModalVisible, setNewChatModalVisible] = useState(false)
  const [newChatName, setNewChatName] = useState<InputState>({
    isFocused: false,
    value: ''
  })
  const [permission, requestPermission] = Notification.usePermissions()
  const headerHeight = useHeaderHeight()
  const textColor = useThemeColor({}, 'text') as string
  const buttonBackground = useThemeColor({}, 'buttonBackground') as string

  const isChatsChatsArray = (chats: Chat[] | string[]): chats is Chat[] => {
    return chats.length > 0 && typeof chats[0] !== 'string'
  }

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

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (permission && !permission?.granted && permission?.canAskAgain) {
        setNotificationModalVisible(true)
      }
    }

    requestNotificationPermission()
  }, [permission])

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
      {(user && isChatsChatsArray(user.chats)) && <FlatList
        data={user.chats}
        renderItem={({ item }) => <ChatFlatListItem item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContainer}
        ListHeaderComponent={<View style={{ height: headerHeight }} />}
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