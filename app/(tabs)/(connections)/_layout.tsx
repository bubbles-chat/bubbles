import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions
} from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { useHeaderHeight } from '@react-navigation/elements'
import { withLayoutContext } from 'expo-router'
import { useColorScheme } from 'react-native'
import { useMemo } from 'react'
import { Colors } from '@/constants/Colors'

const { Navigator } = createMaterialTopTabNavigator()

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator)

const ConnectionsLayout = () => {
    const headerHeight = useHeaderHeight()
    const colorScheme = useColorScheme()
    const background = useMemo(() => colorScheme === 'dark' ? Colors.dark.background : Colors.light.background, [colorScheme])
    const activeTintColor = useMemo(() => colorScheme === 'dark' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected, [colorScheme])
    const inactiveTintColor = useMemo(() => colorScheme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault, [colorScheme])
    const indicatorColor = useMemo(() => colorScheme === 'dark' ? Colors.dark.buttonBackground : Colors.light.buttonBackground, [colorScheme])

    return (
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
    )
}

export default ConnectionsLayout