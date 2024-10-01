import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth'

const Home = () => {
  return (
    <View>
      <Text>Home</Text>
      <Button title='sign out' onPress={() => auth().signOut()} />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})