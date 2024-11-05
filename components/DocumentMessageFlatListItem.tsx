import { Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from './ThemedText'
import { AttachmentMessageFlatListItemProps } from '@/types/types'

const DocumentMessageFlatListItem = ({
    name,
    doesExist,
    progress,
    isDownloading,
    onPressDownload,
    onPressOpen,
    onPressShare
}: AttachmentMessageFlatListItemProps) => {
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
    const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background

    return (
        <Pressable style={[styles.container, { borderColor: textColor, backgroundColor }]} onPress={doesExist ? onPressOpen : undefined}>
            <View style={styles.rowView}>
                <Ionicons
                    name='document'
                    color={textColor}
                    size={30}
                />
                <ThemedText numberOfLines={1}>{name}</ThemedText>
                {doesExist && <Pressable onPress={onPressShare}>
                    <Ionicons
                        name='share-outline'
                        color={textColor}
                        size={30}
                    />
                </Pressable>}
                {!doesExist && !isDownloading ? <Pressable onPress={onPressDownload}>
                    <Ionicons
                        name='download-outline'
                        size={30}
                        color={textColor}
                    />
                </Pressable> :
                    isDownloading ? <ThemedText>{progress}%</ThemedText> : null}
            </View>
        </Pressable>
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
        gap: 8,
        width: 200
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    }
})