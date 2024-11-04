import { Dimensions, Platform, Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import { useEffect, useState } from 'react'
import { Audio } from 'expo-av'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { ATTACHMENTS_LIST_NUM_COLUMN, PADDING_HORIZONTAL } from '@/constants/Dimensions'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import showToast from './Toast'
import { AttachmentScreenFlatListItemProps } from '@/types/types'
import { ThemedText } from './ThemedText'
import CustomModal from './CustomModal'
import CustomButton from './CustomButton'
import { useAttachments } from '@/context/AttachmentsContext'

const AudioAttachmentScreenFlatListItem = ({ mimeType, name, uri }: AttachmentScreenFlatListItemProps) => {
    const [sound, setSound] = useState<Audio.Sound>()
    const [isPlaying, setIsPlaying] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const { setAllAttachments, setAudioAttachments } = useAttachments()
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
    const numColumns = ATTACHMENTS_LIST_NUM_COLUMN
    const screenWidth = Dimensions.get('window').width
    const itemSpacing = 4 * (numColumns - 1)
    const itemWidth = (screenWidth - itemSpacing - PADDING_HORIZONTAL * 2) / numColumns

    const loadSound = async () => {
        const { sound } = await Audio.Sound.createAsync({ uri })

        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.isLoaded && status.didJustFinish) {
                setIsPlaying(false)
                sound.setPositionAsync(0)
                await sound.pauseAsync()
            }
        })
        setSound(sound)
    }

    const playSound = async () => {
        await sound?.playAsync()
        setIsPlaying(true)
    }

    const pauseSound = async () => {
        sound?.pauseAsync()
        setIsPlaying(false)
    }

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
        setAudioAttachments(prev => prev.filter(item => item.uri !== uri))
        setAllAttachments(prev => prev.filter(item => item.uri !== uri))
        showToast(`${name} has been deleted`)
    }

    useEffect(() => {
        loadSound()
    }, [])

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync()
        } : undefined
    }, [sound])

    return (
        <Pressable
            style={[styles.container, { borderColor: textColor, width: itemWidth, height: itemWidth }]}
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
            <View style={styles.infoView}>
                <Ionicons
                    name='musical-note'
                    color={textColor}
                    size={18}
                />
                <ThemedText numberOfLines={1}>{name}</ThemedText>
            </View>
            <View style={styles.playPauseView}>
                {isPlaying ? <Pressable onPress={pauseSound}>
                    <Ionicons
                        name='pause'
                        color={textColor}
                        size={30}
                    />
                </Pressable> : <Pressable onPress={playSound}>
                    <Ionicons
                        name='play'
                        color={textColor}
                        size={30}
                    />
                </Pressable>}
            </View>
        </Pressable>
    )
}

export default AudioAttachmentScreenFlatListItem

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center'
    },
    playPauseView: {
        alignSelf: 'center'
    },
    infoView: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 0
    },
    btnsView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    }
})