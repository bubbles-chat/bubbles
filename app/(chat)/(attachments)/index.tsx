import { FlatList, StyleSheet, View } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import { ATTACHMENTS_LIST_GAP, ATTACHMENTS_LIST_NUM_COLUMN, PADDING_HORIZONTAL, TOP_BAR_HEIGHT } from '@/constants/Dimensions'
import AttachmentScreenFlatListItem from '@/components/AttachmentScreenFlatListItem'
import AttachmentScreenListEmptyComponent from '@/components/AttachmentScreenListEmptyComponent'
import { useAttachments } from '@/context/AttachmentsContext'

const AllAttachments = () => {
    const { allAttachments } = useAttachments()
    const headerHeight = useHeaderHeight()

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={allAttachments}
                renderItem={({ item }) => <AttachmentScreenFlatListItem
                    mimeType={item.mimeType}
                    name={item.name}
                    uri={item.uri}
                />}
                keyExtractor={(item, _) => item.uri}
                ListHeaderComponent={<View style={{ height: headerHeight + TOP_BAR_HEIGHT }} />}
                ListEmptyComponent={<AttachmentScreenListEmptyComponent />}
                numColumns={ATTACHMENTS_LIST_NUM_COLUMN}
                contentContainerStyle={styles.flatListContainer}
                columnWrapperStyle={styles.flatListColumnWrapper}
            />
        </ThemedView>
    )
}

export default AllAttachments

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: PADDING_HORIZONTAL
    },
    flatListContainer: {
        gap: ATTACHMENTS_LIST_GAP,
        flex: 1,
    },
    flatListColumnWrapper: {
        gap: ATTACHMENTS_LIST_GAP,
        justifyContent: 'flex-start'
    }
})