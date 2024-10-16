import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { PADDING_TOP, TOP_BAR_HEIGHT } from '@/constants/Dimensions'
import { useEffect, useState } from 'react'
import Request from '@/models/Request.model'
import SentRequestsListEmptyComponent from '@/components/SentRequestsListEmptyComponent'
import { AxiosError } from 'axios'
import { cancelRequest, getSentRequests } from '@/api/requestApi'
import SentRequestFlatListItem from '@/components/SentRequestFlatListItem'
import { useIsFocused } from '@react-navigation/native'

const SentRequests = () => {
    const [sentRequests, setSentRequests] = useState<Request[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const headerHeight = useHeaderHeight()
    const isFocused = useIsFocused()

    const handleOnCancelPress = async (id: string) => {
        try {
            const response = await cancelRequest(id)

            if (response.status === 200 && response.data.request) {
                setSentRequests(prev => prev.filter(request => request._id !== response.data.request?._id))
            }
        } catch (e) {
            const err = e as AxiosError

            console.error('handleOnCancelPress:', err)
        }
    }

    const fetchRequests = async () => {
        setIsLoading(true)

        try {
            const response = await getSentRequests()

            if (response.status === 200 && response.data.requests) {
                setSentRequests(response.data.requests)
            }
        } catch (e) {
            const err = e as AxiosError

            console.error(err);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [isFocused])

    return (
        <ThemedView style={[styles.contianer, { paddingTop: headerHeight + PADDING_TOP + TOP_BAR_HEIGHT }]}>
            <FlatList
                data={sentRequests}
                renderItem={({ item }) => <SentRequestFlatListItem item={item} onPressCancel={async () => await handleOnCancelPress(item._id)} />}
                keyExtractor={(item, _) => item._id}
                ListEmptyComponent={<SentRequestsListEmptyComponent />}
                contentContainerStyle={styles.flatListContainer}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchRequests} />}
            />
        </ThemedView>
    )
}

export default SentRequests

const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        padding: 8
    },
    flatListContainer: {
        flexGrow: 1
    }
})