import { useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'
import BlurViewContainer from '@/components/BlurViewContainer'

const ChatLayout = () => {
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text

    return (
        <Stack
            screenOptions={{
                headerBackground: () => <BlurViewContainer />,
                headerTransparent: true,
                headerTitleStyle: {
                    color: textColor
                },
                headerTintColor: textColor
            }}
        >
            <Stack.Screen name='index' />
            <Stack.Screen name='(attachments)' options={{ title: "Saved attachments" }} />
            <Stack.Screen name='participants' />
        </Stack>
    )
}

export default ChatLayout