import { Image, StyleSheet, useColorScheme, View } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { useAppSelector } from '@/hooks/useAppSelector'
import { ThemedText } from '@/components/ThemedText'
import CustomButton from '@/components/CustomButton'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { signOutAsync } from '@/store/userAsyncThunks'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { useState } from 'react'
import { PADDING_TOP, TAB_BAR_HEIGHT } from '@/constants/Dimensions'
import CustomModal from '@/components/CustomModal'
import QRCode from 'react-native-qrcode-svg'

const Profile = () => {
    const user = useAppSelector(state => state.user.user)
    const [qrModalVisible, setQrModalVisible] = useState(false)
    const headerHeight = useHeaderHeight()
    const dispatch = useAppDispatch()
    const colorScheme = useColorScheme()
    const iconColor = colorScheme === 'dark' ? Colors.light.text : Colors.dark.text
    const gradient = Colors.dark.gradient.filter(color => color !== '#000')

    const handleShowQrCodeOnPress = () => {
        setQrModalVisible(true)
    }

    const handleHideQrCodeOnPress = () => {
        setQrModalVisible(false)
    }

    const handleSignOutOnPress = () => {
        dispatch(signOutAsync())
    }

    return (
        <ThemedView style={[styles.constainer, { paddingTop: headerHeight + 16 }]}>
            <CustomModal
                visible={qrModalVisible}
                onRequestClose={handleHideQrCodeOnPress}
            >
                <QRCode
                    value={user?._id}
                    enableLinearGradient={true}
                    linearGradient={gradient}
                    backgroundColor='transparent'
                />
                <View style={styles.separator} />
                <CustomButton
                    text='Hide QR code'
                    Icon={<MaterialIcons
                        name='visibility-off'
                        color={iconColor}
                        size={18}
                    />}
                    onPress={handleHideQrCodeOnPress}
                />
            </CustomModal>
            <View style={styles.infoView}>
                <Image
                    source={user?.photoURL.length === 0 ? require('@/assets/images/avatar.png') : { uri: user?.photoURL }}
                    style={styles.image}
                />
                <ThemedText>{user?.displayName}</ThemedText>
            </View>
            <ThemedText>Connections: {user?.connections.length}</ThemedText>
            <View style={styles.separator} />
            <CustomButton
                text='Show QR code'
                Icon={<MaterialIcons
                    name='qr-code'
                    color={iconColor}
                    size={18}
                />}
                onPress={handleShowQrCodeOnPress}
            />
            <View style={styles.separator} />
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
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: 'lightgrey',
        marginRight: 8
    },
    signOutBtn: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: TAB_BAR_HEIGHT + PADDING_TOP,
        alignSelf: 'center'
    },
    separator: {
        height: 8
    }
})