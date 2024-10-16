import { addUser, getUserByEmail } from "@/api/userApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";
import auth from '@react-native-firebase/auth'
import User from "@/models/User.model";
import messaging from '@react-native-firebase/messaging'
import { deleteToken } from "@/api/notificationTokenApi";

export const addUserAsync = createAsyncThunk('user/addUserAsync', async ({
    email,
    displayName,
    photoURL
}: {
    email: string,
    displayName: string,
    photoURL: string
}): Promise<User | null> => {
    try {
        const response = await addUser(email, displayName, photoURL)
        return response.data.user
    } catch (e) {
        return null
    }
})

export const getUserByEmailAsync = createAsyncThunk('user/getUserByEmailAsync', async ({
    email
}: { email: string }): Promise<User | null> => {
    try {
        const response = await getUserByEmail(email)

        return response.data.user
    } catch (e) {
        const err = e as AxiosError

        if (err.status) {
            Alert.alert('Authentication failed!', 'Please sign up first.', [{
                text: 'cancel',
                style: 'cancel'
            }, {
                text: 'OK',
                style: 'default',
                onPress: () => { router.replace('/(auth)/signUp') },
                isPreferred: true
            }])
        } else {
            Alert.alert('Authentication failed!', 'Please try again later.', [{
                text: 'OK',
                style: 'default'
            }])
        }

        return null
    }
})

export const signOutAsync = createAsyncThunk('user/signOutAsync', async (): Promise<void> => {
    try {
        const token = await messaging().getToken()

        await messaging().deleteToken() // unregistering device token from firebase
        await deleteToken(token) // deleting device token from the database
        await auth().signOut()
    } catch (e) {
        Alert.alert('Sign out failed', 'Please try again later', [{
            text: 'OK',
            style: 'default'
        }])
    }
})