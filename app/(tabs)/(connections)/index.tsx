import { FlatList, StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useHeaderHeight } from '@react-navigation/elements'
import { PADDING_TOP, TOP_BAR_HEIGHT } from '@/constants/Dimensions'
import { useEffect, useState } from 'react'
import User from '@/models/User.model'
import { useIsFocused } from '@react-navigation/native'
import ConnectionsListEmptyComponent from '@/components/ConnectionsListEmptyComponent'
import ConnectionsFlatListItem from '@/components/ConnectionsFlatListItem'

const YourConnections = () => {
    const { user } = useAppSelector(state => state.user)
    const [users, setUsers] = useState<User[]>([])
    const headerHeight = useHeaderHeight()
    const isFocused = useIsFocused()

    const connectionIsUserArray = (connections: User[] | string[]): connections is User[] => {
        return connections.length > 0 && typeof connections[0] !== 'string';
    }

    useEffect(() => {
        if (isFocused && user) {
            if (connectionIsUserArray(user.connections)) {
                setUsers(user.connections)
            }
        }
    }, [isFocused])

    return (
        <ThemedView style={[styles.container, { paddingTop: headerHeight + TOP_BAR_HEIGHT + PADDING_TOP }]}>
            <FlatList
                data={users}
                renderItem={({ item }) => <ConnectionsFlatListItem item={item} />}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<ConnectionsListEmptyComponent />}
                contentContainerStyle={styles.flatListContainer}
            />
        </ThemedView>
    )
}

export default YourConnections

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8
    },
    flatListContainer: {
        flexGrow: 1
    }
})