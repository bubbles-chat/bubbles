import { useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { BlurView } from 'expo-blur'
import { Colors } from '@/constants/Colors'

const ChatLayout = () => {
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text

    return (
        <Stack
            screenOptions={{
                headerBackground: () => <BlurView
                    experimentalBlurMethod='dimezisBlurView'
                    intensity={80}
                    tint={colorScheme === 'dark' ? 'dark' : 'light'}
                    style={{ flex: 1 }}
                />,
                headerTransparent: true,
                headerTitleStyle: {
                    color: textColor
                },
                headerTintColor: textColor
            }}
        >
            <Stack.Screen name='index' />
        </Stack>
    )
}

export default ChatLayout