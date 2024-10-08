import { Image, StyleSheet, View } from 'react-native'
import { useAppSelector } from '@/hooks/useAppSelector'

const ProfileTabBarIcon = ({ color, size, focused }: { color: string, size: number, focused: boolean }) => {
    const user = useAppSelector(state => state.user.user)

    return (
        <View
            style={[styles.container, {
                width: size,
                height: size,
                borderRadius: size,
                borderColor: color,
            }]}
        >
            <Image
                source={user?.photoURL.length === 0 ? require('@/assets/images/avatar.png') : { uri: user?.photoURL }}
                style={styles.image}
            />
        </View>
    )
}

export default ProfileTabBarIcon

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderWidth: 2
    },
    image: {
        flex: 1
    }
})