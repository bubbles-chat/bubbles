import { Linking, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Message from '@/models/Message.model'
import { useAppSelector } from '@/hooks/useAppSelector'
import ParsedText, { ParseShape } from 'react-native-parsed-text'
import { Colors } from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { compareDates, getDayName } from '@/utils/date'
import showToast from './Toast'
import socket from '@/api/socket'
import { useState } from 'react'
import CustomModal from './CustomModal'
import { ThemedText } from './ThemedText'
import CustomButton from './CustomButton'
import { MaterialIcons } from '@expo/vector-icons'
import CustomTextInput from './CustomTextInput'
import { InputState } from '@/types/types'
import AttachmentMessageFlatListItems from './AttachmentMessageFlatListItems'
import { isUser } from '@/utils/typeChecker'
import { useThemeColor } from '@/hooks/useThemeColor'

const MessageFlatListItem = ({ item }: { item: Message }) => {
    const { user } = useAppSelector(state => state.user)
    const colorScheme = useColorScheme()

    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false)
    const [optionsModalVisible, setOptionsModalVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [edited, setEdited] = useState<InputState>({
        value: item.text,
        isFocused: false
    })

    const textColor = useThemeColor({}, 'text') as string
    const tint = useThemeColor({}, 'icon') as string

    const today = new Date(); today.setHours(0, 0, 0)
    const previousWeek = new Date(today);
    previousWeek.setDate(today.getDate() - 7);
    previousWeek.setHours(0, 0, 0)

    const sentAt = new Date(item.createdAt as string)
    const sentAtText = compareDates(sentAt, previousWeek) < 0 ?
        `${sentAt.toLocaleDateString()} ${sentAt.toLocaleTimeString()}` : compareDates(sentAt, today) < 0 ?
            `${getDayName(sentAt.getDay())} ${sentAt.toLocaleTimeString()}` : sentAt.toLocaleTimeString()

    const handleUrlOnPress = async (url: string) => {
        try {
            if (await Linking.canOpenURL(url)) {
                await Linking.openURL(url)
            } else {
                showToast("Can't open url")
            }
        } catch (error) {
            console.log('MessageFlatListItem:URL', error);
        }
    }

    const handlePhoneNumberOnPress = async (phoneNumber: string) => {
        try {
            const url = `tel:${phoneNumber}`
            if (await Linking.canOpenURL(url)) {
                await Linking.openURL(url)
            } else {
                showToast("Invalid phone number")
            }
        } catch (error) {
            console.log('MessageFlatListItem:URL', error);
        }
    }

    const handleEmailOnPress = async (email: string) => {
        try {
            const url = `mailto:${email}`
            await Linking.openURL(url)
        } catch (error) {
            showToast("Failed to open email client")
            console.log('MessageFlatListItem:URL', error)
        }
    }

    const handleUserMessageOnLongPress = () => {
        setOptionsModalVisible(true)
    }

    const onRequestCloseOptionsModal = () => {
        setOptionsModalVisible(false)
    }

    const handleOnPressEdit = () => {
        setOptionsModalVisible(false)
        setEditModalVisible(true)
    }

    const handleOnPressDelete = () => {
        setOptionsModalVisible(false)
        setConfirmDeleteModalVisible(true)
    }

    const onRequestCloseEditModal = () => {
        setEditModalVisible(false)
    }

    const onRequestCloseConfirmDeleteModal = () => {
        setConfirmDeleteModalVisible(false)
    }

    const handleOnPressYes = () => {
        socket.emit('chat:deleteMessage', item._id)
        setConfirmDeleteModalVisible(false)
    }

    const handleOnChangeText = (text: string) => {
        setEdited(prev => ({
            ...prev,
            value: text
        }))
    }

    const handleOnPressSave = () => {
        socket.emit('chat:editMessage', { text: edited.value, id: item._id })
        setEditModalVisible(false)
    }

    const parse: ParseShape[] = [
        {
            type: 'url',
            style: [styles.detectedLinksText],
            onPress: handleUrlOnPress
        },
        {
            type: 'phone',
            style: styles.detectedLinksText,
            onPress: handlePhoneNumberOnPress
        },
        {
            type: 'email',
            style: styles.detectedLinksText,
            onPress: handleEmailOnPress
        }
    ]

    if (isUser(item.sender) && user?._id === item.sender._id) {
        const gradient = Colors.dark.gradient.filter(color => color !== '#000')

        return (
            <Pressable style={styles.pressable} onLongPress={handleUserMessageOnLongPress}>
                {/* options modal */}
                <CustomModal visible={optionsModalVisible} onRequestClose={onRequestCloseOptionsModal}>
                    <ThemedText style={styles.modalTitle}>Choose action:</ThemedText>
                    <View style={styles.separator} />
                    <Pressable style={styles.optionBtn} onPress={handleOnPressEdit}>
                        <MaterialIcons
                            name='edit'
                            size={18}
                            color={textColor}
                        />
                        <ThemedText>Edit message</ThemedText>
                    </Pressable>
                    <View style={styles.separator} />
                    <Pressable style={styles.optionBtn} onPress={handleOnPressDelete}>
                        <MaterialIcons
                            name='delete'
                            size={18}
                            color={textColor}
                        />
                        <ThemedText>Delete message</ThemedText>
                    </Pressable>
                    <View style={styles.separator} />
                </CustomModal>
                {/* edit modal */}
                <CustomModal visible={editModalVisible} onRequestClose={onRequestCloseEditModal}>
                    <ThemedText style={styles.modalTitle}>Edit your message</ThemedText>
                    <View style={styles.separator} />
                    <CustomTextInput
                        state={edited}
                        Icon={<MaterialIcons
                            name='edit'
                            size={18}
                            color={textColor}
                        />}
                        placeholder='Enter the edited message'
                        onChangeText={handleOnChangeText}
                    />
                    <View style={styles.separator} />
                    <View style={styles.btnsView}>
                        <CustomButton
                            text='Cancel'
                            hasBackground={false}
                            onPress={onRequestCloseEditModal}
                        />
                        <CustomButton
                            text='Save'
                            onPress={handleOnPressSave}
                        />
                    </View>
                </CustomModal>
                {/* confirm delete modal */}
                <CustomModal visible={confirmDeleteModalVisible} onRequestClose={onRequestCloseConfirmDeleteModal}>
                    <ThemedText style={styles.modalTitle}>Would you like to delete the following message?</ThemedText>
                    <View style={styles.separator} />
                    <ThemedText numberOfLines={3}>{item.text}</ThemedText>
                    <View style={styles.separator} />
                    <View style={styles.btnsView}>
                        <CustomButton
                            text='No'
                            hasBackground={false}
                            onPress={onRequestCloseConfirmDeleteModal}
                        />
                        <CustomButton
                            text='Yes'
                            onPress={handleOnPressYes}
                        />
                    </View>
                </CustomModal>
                <LinearGradient
                    style={styles.container}
                    colors={gradient}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                >
                    <ThemedText style={[styles.senderName]}>you</ThemedText>
                    <View style={styles.attachmentsView}>
                        {item.attachmentsUrl.map(attachment => <AttachmentMessageFlatListItems
                            item={attachment}
                            key={attachment.url}
                            chatId={item.chatId as string}
                        />)}
                    </View>
                    {item.text.length > 0 && <ParsedText
                        style={{ color: '#fff' }}
                        parse={parse}
                    >
                        {item.text}
                    </ParsedText>}
                    <Text style={[styles.timeText]}>{sentAtText}</Text>
                </LinearGradient>
            </Pressable>
        )
    } else {
        const bubbleBackground = colorScheme === 'dark' ? '#343434' : '#d3d3d3'

        return (
            <View style={[styles.container, { backgroundColor: bubbleBackground, alignSelf: 'flex-start' }]}>
                {isUser(item.sender) && <ThemedText style={[styles.senderName, { color: tint }]}>{item.sender.displayName}</ThemedText>}
                <View style={styles.attachmentsView}>
                    {item.attachmentsUrl.map(attachment => <AttachmentMessageFlatListItems
                        item={attachment}
                        key={attachment.url}
                        chatId={item.chatId as string}
                    />)}
                </View>
                {item.text.length > 0 && <ParsedText
                    style={{ color: textColor }}
                    parse={parse}
                >
                    {item.text}
                </ParsedText>}
                <Text style={[styles.timeText, { color: tint }]}>{sentAtText}</Text>
            </View>
        )
    }
}

export default MessageFlatListItem

const styles = StyleSheet.create({
    container: {
        maxWidth: '70%',
        padding: 4,
        borderRadius: 10
    },
    detectedLinksText: {
        textDecorationLine: 'underline'
    },
    timeText: {
        textAlign: 'right',
        color: '#fff'
    },
    pressable: {
        alignSelf: 'flex-end'
    },
    separator: {
        height: 8
    },
    btnsView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    modalTitle: {
        fontWeight: 'bold'
    },
    optionBtn: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start'
    },
    senderName: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#fff'
    },
    attachmentsView: {
        gap: 4
    }
})