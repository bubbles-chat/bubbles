import { Tabs } from 'expo-router'
import { BlurView } from 'expo-blur'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import ProfileTabBarIcon from '@/components/ProfileTabBarIcon'
import { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import { TAB_BAR_HEIGHT } from '@/constants/Dimensions'

const TabLayout = () => {
  const colorScheme = useColorScheme()

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log("remoteMessage:", remoteMessage);
    })
  }, [])

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTransparent: true,
        headerBackground: () => <BlurView
          experimentalBlurMethod='dimezisBlurView'
          intensity={80}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={{ flex: 1 }}
        />,
        headerTitleStyle: {
          color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
        },
        tabBarStyle: {
          position: 'absolute',
          overflow: 'hidden',
          height: TAB_BAR_HEIGHT
        },
        tabBarBackground: () => <BlurView
          experimentalBlurMethod='dimezisBlurView'
          intensity={80}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={{ flex: 1, backgroundColor: 'transparent', borderTopRightRadius: 16, borderTopLeftRadius: 16 }}
        />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colorScheme === 'dark' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected
      })}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => <Ionicons name='chatbubble' color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Ionicons name='search' color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name='(connections)'
        options={{
          title: 'Connections',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='transit-connection-variant' color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => <ProfileTabBarIcon color={color} size={size} focused={focused} />
        }}
      />
    </Tabs>
  )
}

export default TabLayout