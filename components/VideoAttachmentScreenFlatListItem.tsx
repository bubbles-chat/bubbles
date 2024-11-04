import { ATTACHMENTS_LIST_NUM_COLUMN, PADDING_HORIZONTAL } from '@/constants/Dimensions'
import { AttachmentScreenFlatListItemProps } from '@/types/types'
import { ResizeMode, Video } from 'expo-av'
import { useRef, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import CustomModal from './CustomModal'
import { ThemedText } from './ThemedText'
import CustomButton from './CustomButton'
import * as FileSystem from 'expo-file-system'
import { useAttachments } from '@/context/AttachmentsContext'
import showToast from './Toast'

const VideoAttachmentScreenFlatListItem = ({ mimeType, name, uri }: AttachmentScreenFlatListItemProps) => {
    const numColumns = ATTACHMENTS_LIST_NUM_COLUMN
    const screenWidth = Dimensions.get('window').width
    const itemSpacing = 4 * (numColumns - 1)
    const itemWidth = (screenWidth - itemSpacing - PADDING_HORIZONTAL * 2) / numColumns
    const ref = useRef<Video>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const { setAllAttachments, setVideoAttachments } = useAttachments()

    const onPress = () => {
        ref.current?._setFullscreen(true)
    }

    const onLongPress = () => {
        setModalVisible(true)
    }

    const onRequestClose = () => {
        setModalVisible(false)
    }

    const onPressYes = async () => {
        await FileSystem.deleteAsync(uri)
        setModalVisible(false)
        setVideoAttachments(prev => prev.filter(item => item.uri !== uri))
        setAllAttachments(prev => prev.filter(item => item.uri !== uri))
        showToast(`${name} has been deleted`)
    }

    return (
        <Pressable onPress={onPress} onLongPress={onLongPress}>
            <CustomModal visible={modalVisible} onRequestClose={onRequestClose}>
                <ThemedText>Would you like to delete {name}?</ThemedText>
                <View style={styles.btnsView}>
                    <CustomButton
                        text='No'
                        hasBackground={false}
                        onPress={onRequestClose}
                    />
                    <CustomButton
                        text='Yes'
                        onPress={onPressYes}
                    />
                </View>
            </CustomModal>
            <Video
                ref={ref}
                style={{ width: itemWidth, height: itemWidth }}
                source={{ uri }}
                isLooping
                shouldPlay
                volume={0}
                resizeMode={ResizeMode.CONTAIN}
            />
        </Pressable>
    )
}

export default VideoAttachmentScreenFlatListItem

const styles = StyleSheet.create({
    btnsView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    }
})