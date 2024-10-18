import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { PADDING_TOP, TOP_BAR_HEIGHT } from '@/constants/Dimensions'
import { AxiosError } from 'axios'
import { acceptRequest, getPendingRequests, rejectRequest } from '@/api/requestApi'
import Request from '@/models/Request.model'
import PendingRequestFlatListItem from '@/components/PendingRequestFlatListItem'
import PendingRequestListEmptyComponent from '@/components/PendingRequestListEmptyComponent'
import { useIsFocused } from '@react-navigation/native'
import showToast from '@/components/Toast'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { getUserByEmailAsync } from '@/store/userAsyncThunks'
import auth from '@react-native-firebase/auth'

const PendingRequests = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [pendingRequests, setPendingRequests] = useState<Request[]>([])
    const headerHeight = useHeaderHeight()
    const isFocused = useIsFocused()
    const dispatch = useAppDispatch()

    const handleOnPressAccept = async (id: string) => {
        try {
            const response = await acceptRequest(id)
            const email = auth().currentUser?.email as string

            if (response.status === 200 && response.data.request) {
                setPendingRequests(prev => prev.filter(request => request._id !== response.data.request?._id))
                showToast('Request has been accepted')
                dispatch(getUserByEmailAsync({ email }))
            }
        } catch (e) {
            const err = e as AxiosError

            console.log('handleOnPressAccept:', err.response?.data);
        }
    }

    const handleOnPressReject = async (id: string) => {
        try {
            const response = await rejectRequest(id)

            if (response.status === 200 && response.data.request) {
                setPendingRequests(prev => prev.filter(request => request._id !== response.data.request?._id))
                showToast('Request has been rejected')
            }
        } catch (e) {
            const err = e as AxiosError

            console.log('handleOnPressReject:', err.response?.data);
        }
    }

    const fetchRequests = async () => {
        setIsLoading(true)

        try {
            const response = await getPendingRequests()

            if (response.status === 200 && response.data.requests) {
                setPendingRequests(response.data.requests)
            }
        } catch (e) {
            const err = e as AxiosError

            console.log(err.response?.data);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isFocused) {
            fetchRequests()
        }
    }, [isFocused])

    return (
        <ThemedView style={[styles.container, { paddingTop: headerHeight + PADDING_TOP + TOP_BAR_HEIGHT }]}>
            <FlatList
                data={pendingRequests}
                renderItem={({ item }) => <PendingRequestFlatListItem
                    item={item}
                    onPressAccept={async () => await handleOnPressAccept(item._id)}
                    onPressReject={async () => await handleOnPressReject(item._id)}
                />}
                keyExtractor={(item, _) => item._id}
                ListEmptyComponent={<PendingRequestListEmptyComponent />}
                contentContainerStyle={styles.flatListContainer}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchRequests} />}
            />
        </ThemedView>
    )
}

export default PendingRequests

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flatListContainer: {
        flexGrow: 1
    }
})