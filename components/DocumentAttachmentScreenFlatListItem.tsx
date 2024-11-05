import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ATTACHMENTS_LIST_NUM_COLUMN, PADDING_HORIZONTAL } from '@/constants/Dimensions'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import showToast from './Toast'
import { AttachmentScreenFlatListItemProps } from '@/types/types'
import { ThemedText } from './ThemedText'
import CustomModal from './CustomModal'
import CustomButton from './CustomButton'
import { useAttachments } from '@/context/AttachmentsContext'
import { useState } from 'react'

const DocumentAttachmentScreenFlatListItem = ({ mimeType, name, uri }: AttachmentScreenFlatListItemProps) => {
    const textColor = useThemeColor({}, 'text') as string
    const [modalVisible, setModalVisible] = useState(false)
    const { setAllAttachments, setOtherAttachments } = useAttachments()
    const numColumns = ATTACHMENTS_LIST_NUM_COLUMN
    const screenWidth = Dimensions.get('window').width
    const itemSpacing = 4 * (numColumns - 1)
    const itemWidth = (screenWidth - itemSpacing - PADDING_HORIZONTAL * 2) / numColumns

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
        setOtherAttachments(prev => prev.filter(item => item.uri !== uri))
        setAllAttachments(prev => prev.filter(item => item.uri !== uri))
        showToast(`${name} has been deleted`)
    }

    return (
        <Pressable
            style={[styles.container, { width: itemWidth, height: itemWidth }]}
            onPress={onPress}
            onLongPress={onLongPress}
        >
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
            <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
            <Ionicons
                name='document'
                size={30}
                color={textColor}
            />
        </Pressable>
    )
}

export default DocumentAttachmentScreenFlatListItem

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        position: 'absolute',
        top: 0,
        alignSelf: 'flex-start'
    },
    btnsView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    }
})