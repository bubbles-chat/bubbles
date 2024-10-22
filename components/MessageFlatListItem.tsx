import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import Message from '@/models/Message.model'
import { useAppSelector } from '@/hooks/useAppSelector'
import ParsedText, { ParseShape } from 'react-native-parsed-text'
import { Colors } from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { compareDates, getDayName } from '@/utils/date'

const MessageFlatListItem = ({ item }: { item: Message }) => {
    const { user } = useAppSelector(state => state.user)
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
    const tint = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon
    const today = new Date(); today.setHours(0, 0, 0)
    const previousWeek = new Date(today);
    previousWeek.setDate(today.getDate() - 7);
    previousWeek.setHours(0, 0, 0)
    const sentAt = compareDates(item.createdAt, previousWeek) < 0 ?
        `${item.createdAt.toLocaleDateString()} ${item.createdAt.toLocaleTimeString()}` : compareDates(item.createdAt, today) < 0 ?
            `${getDayName(item.createdAt.getDay())} ${item.createdAt.toLocaleTimeString()}` : item.createdAt.toLocaleTimeString()
    const parse: ParseShape[] = [
        {
            type: 'url',
            style: [styles.detectedLinksText],
            onPress: () => alert('Link pressed')
        },
        {
            type: 'phone',
            style: styles.detectedLinksText,
            onPress: () => alert('Phone pressed')
        },
        {
            type: 'email',
            style: styles.detectedLinksText,
            onPress: () => alert('Email pressed')
        }
    ]

    if (user?._id === item.sender) {
        const gradient = colorScheme === 'dark' ? Colors.dark.gradient.filter(color => color !== '#000') : Colors.light.gradient

        return (
            <LinearGradient
                style={[styles.container, { alignSelf: 'flex-end' }]}
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
                <Text style={[styles.timeText, { color: tint }]}>{sentAt}</Text>
            </LinearGradient>
        )
    } else {
        const bubbleBackground = colorScheme === 'dark' ? '#343434' : '#d3d3d3'

        return (
            <View style={[styles.container, { backgroundColor: bubbleBackground }]}>
                <ParsedText
                    style={{ color: textColor }}
                    parse={parse}
                >
                    {item.text}
                </ParsedText>
                <Text style={[styles.timeText, { color: tint }]}>{sentAt}</Text>
            </View>
        )
    }
}

export default MessageFlatListItem

const styles = StyleSheet.create({
    container: {
        maxWidth: '75%',
        padding: 8,
        borderRadius: 10
    },
    detectedLinksText: {
        textDecorationLine: 'underline'
    },
    timeText: {
        textAlign: 'right'
    }
})