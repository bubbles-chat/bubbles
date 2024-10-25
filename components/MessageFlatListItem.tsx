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

const MessageFlatListItem = ({ item }: { item: Message }) => {
    const { user } = useAppSelector(state => state.user)
    const colorScheme = useColorScheme()

    const [modalVisible, setModalVisible] = useState(false)

    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
    const tint = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon

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
        setModalVisible(true)
    }

    const onRequestClose = () => {
        setModalVisible(false)
    }

    const handleOnPressYes = () => {
        socket.emit('chat:deleteMessage', item._id)
        setModalVisible(false)
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

    if (user?._id === item.sender) {
        const gradient = colorScheme === 'dark' ? Colors.dark.gradient.filter(color => color !== '#000') : Colors.light.gradient

        return (
            <Pressable style={styles.pressable} onLongPress={handleUserMessageOnLongPress}>
                <CustomModal visible={modalVisible} onRequestClose={onRequestClose}>
                    <ThemedText style={{ fontWeight: 'bold' }}>Would you like to delete the following message?</ThemedText>
                    <View style={styles.separator} />
                    <ThemedText numberOfLines={3}>{item.text}</ThemedText>
                    <View style={styles.separator} />
                    <View style={styles.btnsView}>
                        <CustomButton
                            text='No'
                            hasBackground={false}
                            onPress={onRequestClose}
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
                    <ParsedText
                        style={{ color: textColor }}
                        parse={parse}
                    >
                        {item.text}
                    </ParsedText>
                    <Text style={[styles.timeText, { color: tint }]}>{sentAtText}</Text>
                </LinearGradient>
            </Pressable>
        )
    } else {
        const bubbleBackground = colorScheme === 'dark' ? '#343434' : '#d3d3d3'

        return (
            <View style={[styles.container, { backgroundColor: bubbleBackground, alignSelf: 'flex-start' }]}>
                <ParsedText
                    style={{ color: textColor }}
                    parse={parse}
                >
                    {item.text}
                </ParsedText>
                <Text style={[styles.timeText, { color: tint }]}>{sentAtText}</Text>
            </View>
        )
    }
}

export default MessageFlatListItem

const styles = StyleSheet.create({
    container: {
        maxWidth: '70%',
        padding: 8,
        borderRadius: 10
    },
    detectedLinksText: {
        textDecorationLine: 'underline'
    },
    timeText: {
        textAlign: 'right'
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
    }
})