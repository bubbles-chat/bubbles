import { FlatList, StyleSheet, View } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { useAttachments } from '@/context/AttachmentsContext'
import { useHeaderHeight } from '@react-navigation/elements'
import { ATTACHMENTS_LIST_GAP, ATTACHMENTS_LIST_NUM_COLUMN, TOP_BAR_HEIGHT } from '@/constants/Dimensions'
import AttachmentScreenListEmptyComponent from '@/components/AttachmentScreenListEmptyComponent'
import AudioAttachmentScreenFlatListItem from '@/components/AudioAttachmentScreenFlatListItem'

const Audio = () => {
    const { audioAttachments } = useAttachments()
    const headerHeight = useHeaderHeight()

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={audioAttachments}
                renderItem={({ item }) => <AudioAttachmentScreenFlatListItem
                    mimeType={item.mimeType}
                    name={item.name}
                    uri={item.uri}
                />}
                keyExtractor={(item, _) => item.uri}
                ListHeaderComponent={<View style={{ height: headerHeight + TOP_BAR_HEIGHT }} />}
                ListEmptyComponent={<AttachmentScreenListEmptyComponent keyword='audios' />}
                numColumns={ATTACHMENTS_LIST_NUM_COLUMN}
                contentContainerStyle={styles.flatListContainer}
                columnWrapperStyle={styles.flatListColumnWrapper}
            />
        </ThemedView>
    )
}

export default Audio

const styles = StyleSheet.create({
    container: {
        flex: 1
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