import { Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from './ThemedText'
import { AttachmentMessageFlatListItemProps } from '@/types/types'

const DocumentMessageFlatListItem = ({
    uri,
    name,
    doesExist,
    progress,
    isDownloading,
    onPressDownload,
    onPressOpen
}: AttachmentMessageFlatListItemProps) => {
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
    const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background

    return (
        <View style={[styles.container, { borderColor: textColor, backgroundColor }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                    name='document'
                    color={textColor}
                    size={40}
                />
                <ThemedText numberOfLines={1}>{name}</ThemedText>
            </View>
            <View>
                {!doesExist && !isDownloading ? <Pressable onPress={onPressDownload}>
                    <Ionicons
                        name='download-outline'
                        size={30}
                        color={textColor}
                    />
                </Pressable> :
                    isDownloading ? <ThemedText>{progress}</ThemedText> :
                        <Pressable onPress={onPressOpen}>
                            <Ionicons
                                name='open-outline'
                                size={30}
                                color={textColor}
                            />
                        </Pressable>}
            </View>
        </View>
    )
}

export default DocumentMessageFlatListItem

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        width: 200
    },
})