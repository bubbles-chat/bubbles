import Header from '@/components/Header'
import { BlurView } from 'expo-blur'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        header: (props) => <Header {...props} />,
        headerTransparent: true
      }}
    >
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='signUp' options={{ headerTitle: 'Sign up' }} />
      <Stack.Screen name='forgotPassword' options={{ headerTitle: 'Forgot password' }} />
    </Stack>
  )
}

export default AuthLayout