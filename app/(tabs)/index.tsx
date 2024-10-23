import { FlatList, Platform, StyleSheet, View } from 'react-native'
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

const Home = () => {
  const { user } = useAppSelector(state => state.user)
  const [modalVisible, setModalVisible] = useState(false)
  const [permission, requestPermission] = Notification.usePermissions()
  const headerHeight = useHeaderHeight()

  const isChatsIsChatsArray = (chats: Chat[] | string[]): chats is Chat[] => {
    return chats.length > 0 && typeof chats[0] !== 'string'
  }

  const handleDeclineOnPress = () => {
    setModalVisible(false)
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

      setModalVisible(false)
    } catch (e) {
      const err = e as AxiosError
      console.error(err.response?.data);
    }
  }

  useEffect(() => {
    const requestNotificationPermission = async () => {      
      if (permission && !permission?.granted && permission?.canAskAgain) {        
        setModalVisible(true)
      }
    }

    requestNotificationPermission()
  }, [permission])

  return (
    <ThemedView style={[styles.contianer]}>
      <CustomModal visible={modalVisible}>
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
      {(user && isChatsIsChatsArray(user.chats)) && <FlatList
        data={user.chats}
        renderItem={({ item }) => <ChatFlatListItem item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={<ChatListEmptyComponent />}
        ListHeaderComponent={<View style={{ height: headerHeight }} />}
      />}
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
  }
})