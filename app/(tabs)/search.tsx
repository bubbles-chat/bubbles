import { ActivityIndicator, FlatList, Image, StyleSheet, useColorScheme, View } from 'react-native'
import { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import CustomTextInput from '@/components/CustomTextInput'
import { InputState } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { Colors } from '@/constants/Colors'
import User from '@/models/User.model'
import useDebounce from '@/hooks/useDebounce'
import { getUserById, getUserByUsername } from '@/api/userApi'
import { AxiosError } from 'axios'
import UserFlatListItem from '@/components/UserFlatListItem'
import UserListEmptyComponent from '@/components/UserListEmptyComponent'
import { addRequest } from '@/api/requestApi'
import showToast from '@/components/Toast'
import { useIsFocused } from '@react-navigation/native'
import CustomModal from '@/components/CustomModal'
import { CameraView, useCameraPermissions } from 'expo-camera'
import CustomButton from '@/components/CustomButton'
import { BarCodeScanningResult } from 'expo-camera/build/legacy/Camera.types'
import { PADDING_TOP } from '@/constants/Dimensions'
import { ThemedText } from '@/components/ThemedText'

const Search = () => {
    const [search, setSearch] = useState<InputState>({
        value: '',
        isFocused: false
    })
    const [users, setUsers] = useState<User[]>([])
    const [scannedUser, setScannedUser] = useState<User | undefined>()
    const [scannedUserModalVisible, setScannedUserModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const isFocused = useIsFocused()
    const headerHeight = useHeaderHeight()
    const colorScheme = useColorScheme()
    const iconColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
    const [permission, requestPermission] = useCameraPermissions()

    const handleSearchOnChangeText = (text: string): void => {
        setSearch((prev) => ({
            ...prev,
            value: text
        }))
    }

    const handleSearchOnFocus = (): void => {
        setSearch(prev => ({
            ...prev,
            isFocused: true
        }))
    }

    const handleSearchOnBlur = (): void => {
        setSearch(prev => ({
            ...prev,
            isFocused: false
        }))
    }

    const handleFlatListOnEndReached = async () => {
        if (hasMore) {
            await fetchUsersOnEndReached(page + 1)
            setPage(prev => prev + 1)
        }
    }

    const handleOnPressAdd = async (id: string) => {
        try {
            const response = await addRequest(id)

            if (response.status === 201) {
                setUsers(prev => prev.filter(user => user._id !== id))
                showToast('Request has been sent')
            }
        } catch (e) {
            const err = e as AxiosError

            console.error('handleAddOnPress:', err.response?.data);
        }
    }

    const fetchUsersBasedOnSearchValue = async () => {
        setIsLoading(true)
        setHasMore(true)
        setPage(0)

        const limit = 10

        try {
            if (search.value.length > 0 && isFocused) {

                const response = await getUserByUsername(search.value, limit, 0)
                const { users } = response.data

                if (users.length < limit) {
                    setHasMore(false)
                }

                setUsers(users)
            }
        } catch (e) {
            const err = e as AxiosError
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchUsersOnEndReached = async (page = 0) => {
        setIsLoading(true)

        const limit = 10
        const skip = page * limit

        try {
            if (search.value.length > 0) {
                const response = await getUserByUsername(search.value, limit, skip)
                const { users } = response.data

                if (users.length < limit) {
                    setHasMore(false)
                }

                setUsers(prev => [...prev, ...users])
            }
        } catch (e) {
            const err = e as AxiosError
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOnPressCamera = () => {
        setModalVisible(true)
    }

    const handleCameraModalOnRequestClose = () => {
        setModalVisible(false)
    }

    const handleScannedUserModalOnRequestClose = () => {
        setScannedUserModalVisible(false)
        setScannedUser(undefined)
    }

    const handleOnBarCodeScanned = async ({ data }: BarCodeScanningResult) => {
        try {
            const response = await getUserById(data)

            if (response.status === 200) {
                setScannedUser(response.data.user)
                setScannedUserModalVisible(true)
                setModalVisible(false)
            }
        } catch (e) {
            const err = e as AxiosError

            console.log(err.response?.data);
        }
    }

    const handleScannedUserModalOnPressYes = async () => {
        setIsModalLoading(true)
        if (scannedUser) {
            await handleOnPressAdd(scannedUser._id)
            setScannedUserModalVisible(false)
            setScannedUser(undefined)
        }
        setIsModalLoading(false)
    }

    useDebounce(fetchUsersBasedOnSearchValue, [search.value, isFocused], 800)

    useEffect(() => {
        if (search.value.length === 0) {
            setUsers([])
            setPage(0)
            setHasMore(true)
        }
    }, [search.value])

    useEffect(() => {
        requestPermission()
    }, [])

    return (
        <ThemedView style={[styles.container, { paddingTop: headerHeight + PADDING_TOP }]}>
            {permission?.granted && <CustomModal visible={modalVisible} onRequestClose={handleCameraModalOnRequestClose}>
                <ThemedText>Scan the QR code of another user</ThemedText>
                <View style={styles.separator} />
                <View style={{ borderRadius: 16, overflow: 'hidden' }}>
                    <CameraView
                        style={{ height: 300, width: 300 }}
                        ratio='1:1'
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={handleOnBarCodeScanned}
                    />
                </View>
                <View style={styles.separator} />
                <CustomButton
                    text='Cancel'
                    hasBackground={false}
                    onPress={handleCameraModalOnRequestClose}
                />
            </CustomModal>}
            {scannedUser && <CustomModal visible={scannedUserModalVisible} onRequestClose={handleScannedUserModalOnRequestClose}>
                <ThemedText>Would you like to connect with the following user?</ThemedText>
                <View style={styles.separator} />
                <View style={styles.flexDirectionRowView}>
                    <Image
                        style={styles.image}
                        source={scannedUser?.photoURL.length === 0 ? require('@/assets/images/avatar.png') : { uri: scannedUser?.photoURL }}
                    />
                    <ThemedText>{scannedUser.displayName}</ThemedText>
                </View>
                <View style={styles.separator} />
                {isModalLoading ? <ActivityIndicator size={'large'} /> : <View style={[styles.flexDirectionRowView, { justifyContent: 'space-between', width: '100%' }]}>
                    <CustomButton
                        hasBackground={false}
                        text='cancel'
                        onPress={handleScannedUserModalOnRequestClose}
                    />
                    <CustomButton
                        text='yes'
                        onPress={handleScannedUserModalOnPressYes}
                    />
                </View>}
            </CustomModal>}
            <CustomTextInput
                state={search}
                Icon={<Ionicons
                    name='search'
                    size={18}
                    color={iconColor}
                />}
                placeholder='Enter a username'
                onChangeText={handleSearchOnChangeText}
                onFocus={handleSearchOnFocus}
                onBlur={handleSearchOnBlur}
                keyboardAppearance='default'
                pressableIcon={<Ionicons
                    name='camera-outline'
                    color={iconColor}
                    size={18}
                />}
                pressableOnPress={handleOnPressCamera}
            />
            <FlatList
                data={users}
                renderItem={({ item }) => <UserFlatListItem item={item} onPressAdd={async () => await handleOnPressAdd(item._id)} />}
                keyExtractor={(item, _) => item._id}
                onEndReached={handleFlatListOnEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading ? <ActivityIndicator size={'large'} /> : null}
                ListEmptyComponent={<UserListEmptyComponent query={search.value} />}
                contentContainerStyle={styles.flatListContainer}
                keyboardDismissMode='on-drag'
            />
        </ThemedView>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8
    },
    flatListContainer: {
        flexGrow: 1
    },
    separator: {
        height: 8
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginRight: 8
    },
    flexDirectionRowView: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})