import client from "@/api/client";
import socket from "@/api/socket";
import Loading from "@/components/Loading";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { store } from "@/store/store";
import { getUserByEmailAsync } from "@/store/userAsyncThunks";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";

function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true)
  const user = useAppSelector(state => state.user.user)

  const dispatch = useAppDispatch()

  const router = useRouter()

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null): Promise<void> => {
    if (user) {
      const token = await user.getIdToken()
      const email = user?.email ?? ''
      const authHeader = `Bearer ${token}`
      client.defaults.headers.common['Authorization'] = authHeader
      socket.auth = {
        token: authHeader
      }

      console.log('onAuthStateChanged', token);
      dispatch(getUserByEmailAsync({ email }))
    } else {
      client.defaults.headers.common['Authorization'] = undefined
    }

    if (isInitializing) setIsInitializing(false)
  }

  const onIdTokenChanged = async (user: FirebaseAuthTypes.User | null): Promise<void> => {
    if (user) {
      const token = await user.getIdToken()
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`

      console.log('onIdTokenChanged', token);
    } else {
      client.defaults.headers.common['Authorization'] = undefined
    }
  }

  useEffect(() => {
    const sub = auth().onAuthStateChanged(onAuthStateChanged)
    const tokenSub = auth().onIdTokenChanged(onIdTokenChanged)

    socket.connect()

    return () => {
      sub()
      tokenSub()
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (isInitializing) return

    if (user)
      router.replace('/(tabs)/')
    else
      router.replace('/(auth)')

  }, [user, isInitializing])

  if (isInitializing) {
    return <Loading visible={isInitializing} />
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <RootLayout />
      </Provider>
    </RootSiblingParent>
  )
}
