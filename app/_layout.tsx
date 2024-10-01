import Loading from "@/components/Loading";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>()

  const router = useRouter()

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null): void => {
    console.log('onAuthStateChanged', user);
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
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
