import { Image, StyleSheet, View } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { useAppSelector } from '@/hooks/useAppSelector'
import { ThemedText } from '@/components/ThemedText'
import CustomButton from '@/components/CustomButton'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { signOutAsync } from '@/store/userAsyncThunks'

const Profile = () => {
    const user = useAppSelector(state => state.user.user)
    const headerHeight = useHeaderHeight()
    const dispatch = useAppDispatch()

    const handleSignOutOnPress = () => {
        dispatch(signOutAsync())
    }

    return (
        <ThemedView style={[styles.constainer, { paddingTop: headerHeight + 16 }]}>
            <View style={styles.infoView}>
                <Image
                    source={user?.photoURL.length === 0 ? require('@/assets/images/avatar.png') : { uri: user?.photoURL }}
                    style={styles.image}
                />
                <ThemedText>{user?.email}</ThemedText>
            </View>
            <CustomButton
                style={styles.signOutBtn}
                text='Sign out'
                onPress={handleSignOutOnPress}
            />
        </ThemedView>
    )
}

export default Profile

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        paddingHorizontal: 8
    },
    infoView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: 'lightgrey'
    },
    signOutBtn: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: 'red'
    }
})