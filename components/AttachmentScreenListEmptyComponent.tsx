import { StyleSheet, View } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ThemedText } from './ThemedText'

const AttachmentScreenListEmptyComponent = ({ keyword = "attachments" }: { keyword?: string }) => {
    const textColor = useThemeColor({}, 'text') as string

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons
                name='attachment'
                color={textColor}
                size={100}
            />
            <ThemedText>There are no saved {keyword} for this chat.</ThemedText>
        </View>
    )
}

export default AttachmentScreenListEmptyComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})