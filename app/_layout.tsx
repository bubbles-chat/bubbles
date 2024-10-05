import Loading from "@/components/Loading";
import { store } from "@/store/store";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";

export default function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>()

  const router = useRouter()

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null): Promise<void> => {
    const token = await user?.getIdToken()
    console.log('onAuthStateChanged', token);
    setUser(user)

    if (isInitializing) setIsInitializing(false)
  }

  useEffect(() => {
    const sub = auth().onAuthStateChanged(onAuthStateChanged)
    return sub
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
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
