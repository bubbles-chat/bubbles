import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { PADDING_TOP, TOP_BAR_HEIGHT } from '@/constants/Dimensions'
import { AxiosError } from 'axios'
import { getPendingRequests } from '@/api/requestApi'
import Request from '@/models/Request.model'
import PendingRequestFlatListItem from '@/components/PendingRequestFlatListItem'
import PendingRequestListEmptyComponent from '@/components/PendingRequestListEmptyComponent'
import { useIsFocused } from '@react-navigation/native'

const PendingRequests = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [pendingRequests, setPendingRequests] = useState<Request[]>([])
    const headerHeight = useHeaderHeight()
    const isFocused = useIsFocused()

    const handleOnPressAccept = async (id: string) => {
        //todo
    }

    const handleOnPressReject = async (id: string) => {
        // todo
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
        fetchRequests()
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