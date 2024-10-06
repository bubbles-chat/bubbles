import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { signOutAsync } from '@/store/userAsyncThunks'

const Home = () => {
  const dispatch = useAppDispatch()

  const handleSignOutOnPress = () => {
    dispatch(signOutAsync())
  }

  return (
    <View>
      <Text>Home</Text>
      <Button title='sign out' onPress={handleSignOutOnPress} />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})