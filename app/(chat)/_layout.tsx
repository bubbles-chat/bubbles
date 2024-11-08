import { Stack } from 'expo-router'
import BlurViewContainer from '@/components/BlurViewContainer'
import { StatusBar } from 'expo-status-bar'
import { useThemeColor } from '@/hooks/useThemeColor'

const ChatLayout = () => {
    const textColor = useThemeColor({}, 'text') as string

    return (
        <>
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
            <StatusBar backgroundColor='transparent' />
        </>
    )
}

export default ChatLayout