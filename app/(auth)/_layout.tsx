import { Colors } from '@/constants/Colors'
import { BlurView } from 'expo-blur'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'

const AuthLayout = () => {
  const colorScheme = useColorScheme()

  return (
    <Stack
      screenOptions={({ route }) => ({
        headerBackground: () => <BlurView
          experimentalBlurMethod='dimezisBlurView'
          intensity={80}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={{ flex: 1 }}
        />,
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
  )
}

export default AuthLayout