import BlurViewContainer from '@/components/BlurViewContainer'
import { Colors } from '@/constants/Colors'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'

const AuthLayout = () => {
  const colorScheme = useColorScheme()

  return (
    <>
      <Stack
        screenOptions={({ route }) => ({
          headerBackground: () => <BlurViewContainer />,
          headerTransparent: true,
          headerTitleStyle: {
            color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
          },
          headerBackVisible: false
        })}
      >
        <Stack.Screen name='index' options={{ title: 'Bubbles' }} />
        <Stack.Screen name='signUp' options={{ title: 'Sign up' }} />
        <Stack.Screen name='forgotPassword' options={{ title: 'Forgot password' }} />
      </Stack>
      <StatusBar backgroundColor='transparent' />
    </>
  )
}

export default AuthLayout