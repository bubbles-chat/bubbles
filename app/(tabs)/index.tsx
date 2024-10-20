import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { ThemedText } from '@/components/ThemedText'
import CustomModal from '@/components/CustomModal'
import CustomButton from '@/components/CustomButton'
import { AxiosError } from 'axios'
import messaging from '@react-native-firebase/messaging'
import { addToken } from '@/api/notificationTokenApi'
import * as Notification from 'expo-notifications'

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const headerHeight = useHeaderHeight()

  const handleDeclineOnPress = () => {
    setModalVisible(false)
  }

  const handleAcceptOnPress = async () => {
    try {
      const requestResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

      if (requestResult === 'granted') {
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
      const res = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

      if (!res) {
        setModalVisible(true)
      }
    }

    requestNotificationPermission()
  }, [])

  return (
    <ThemedView style={[styles.contianer, { paddingTop: headerHeight + 16 }]}>
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
      <ThemedText>Home</ThemedText>
      {/* <CustomModal visible={true} /> */}
      {/* <Button title='sign out' onPress={handleSignOutOnPress} /> */}
      {/* <View style={{ width: 30, height: 30, bottom: 0, backgroundColor: 'red', position: 'absolute' }} /> */}
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'flex-start'
  }
})