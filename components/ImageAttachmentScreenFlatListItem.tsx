import { ATTACHMENTS_LIST_NUM_COLUMN, PADDING_HORIZONTAL } from '@/constants/Dimensions'
import { Dimensions, Image, Platform, Pressable, StyleSheet, View } from 'react-native'
import * as IntentLauncher from 'expo-intent-launcher'
import * as FileSystem from 'expo-file-system'
import showToast from './Toast'
import { AttachmentScreenFlatListItemProps } from '@/types/types'
import CustomModal from './CustomModal'
import { useState } from 'react'
import { ThemedText } from './ThemedText'
import CustomButton from './CustomButton'
import { useAttachments } from '@/context/AttachmentsContext'

const ImageAttachmentScreenFlatListItem = ({ mimeType, name, uri }: AttachmentScreenFlatListItemProps) => {
    const numColumns = ATTACHMENTS_LIST_NUM_COLUMN
    const screenWidth = Dimensions.get('window').width
    const itemSpacing = 4 * (numColumns - 1)
    const itemWidth = (screenWidth - itemSpacing - PADDING_HORIZONTAL * 2) / numColumns

    const [modalVisible, setModalVisible] = useState(false)
    const { setPhotoAttachments, setAllAttachments } = useAttachments()

    const onPress = async () => {
        const contentUri = await FileSystem.getContentUriAsync(uri)

        if (Platform.OS === 'android') {
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: contentUri,
                type: mimeType,
                flags: 1
            })
        } else {
            showToast("This action is currently supported on Android")
        }
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
        setPhotoAttachments(prev => prev.filter(item => item.uri !== uri))
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
            <Image
                style={{ width: itemWidth, height: itemWidth }}
                source={{ uri }}
            />
        </Pressable>
    )
}

export default ImageAttachmentScreenFlatListItem

const styles = StyleSheet.create({
    btnsView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    }
})