import { useHeaderHeight } from '@react-navigation/elements'
import MaterialTopTabs from '@/components/navigation/MaterialTopTabs'
import { StatusBar } from 'expo-status-bar'
import { useThemeColor } from '@/hooks/useThemeColor'


const ConnectionsLayout = () => {
    const headerHeight = useHeaderHeight()
    const background = useThemeColor({}, 'background') as string
    const activeTintColor = useThemeColor({}, 'tabIconSelected') as string
    const inactiveTintColor = useThemeColor({}, 'tabIconDefault') as string
    const indicatorColor = useThemeColor({}, 'buttonBackground') as string

    return (
        <>
            <MaterialTopTabs
                screenOptions={{
                    tabBarStyle: {
                        top: headerHeight,
                        backgroundColor: background,
                        position: 'absolute',
                        height: 50,
                        width: '100%',
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                        overflow: 'hidden'
                    },
                    tabBarActiveTintColor: activeTintColor,
                    tabBarInactiveTintColor: inactiveTintColor,
                    tabBarIndicatorStyle: {
                        backgroundColor: indicatorColor,
                        height: 4
                    },
                    tabBarLabelStyle: {
                        textTransform: 'capitalize'
                    }
                }}
            >
                <MaterialTopTabs.Screen name='index' options={{ title: 'Connections' }} />
                <MaterialTopTabs.Screen name='pendingRequests' options={{ title: 'Pending' }} />
                <MaterialTopTabs.Screen name='sentRequests' options={{ title: 'Sent' }} />
            </MaterialTopTabs>
            <StatusBar backgroundColor='transparent' />
        </>
    )
}

export default ConnectionsLayout