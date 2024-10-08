import { StyleSheet, View } from 'react-native'
import React from 'react'
// import auth from '@react-native-firebase/auth'
// import { useAppDispatch } from '@/hooks/useAppDispatch'
import { signOutAsync } from '@/store/userAsyncThunks'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { ThemedText } from '@/components/ThemedText'

const Home = () => {
  // const dispatch = useAppDispatch()
  const headerHeight = useHeaderHeight()

  // const handleSignOutOnPress = () => {
  //   dispatch(signOutAsync())
  // }

  return (
    <ThemedView style={[styles.contianer, { paddingTop: headerHeight + 16 }]}>
      <ThemedText>Home</ThemedText>
      {/* <Button title='sign out' onPress={handleSignOutOnPress} /> */}
      {/* <View style={{ width: 30, height: 30, bottom: 0, backgroundColor: 'red', position: 'absolute' }} /> */}
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  contianer: {
    flex: 1
  }
})