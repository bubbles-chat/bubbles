import { Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from './ThemedText'

const DocumentPreviewFlatListItem = ({ name, onPress }: { name: string, onPress: () => any }) => {
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text

    return (
        <View style={[styles.constainer, { borderColor: textColor }]}>
            <Ionicons
                name='document'
                color={textColor}
                size={40}
            />
            <Pressable style={styles.pressable} onPress={onPress}>
                <Ionicons
                    name='close-circle'
                    color={textColor}
                    size={18}
                />
            </Pressable>
            <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
        </View>
    )
}

export default DocumentPreviewFlatListItem

const styles = StyleSheet.create({
    constainer: {
        height: 100,
        width: 100,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pressable: {
        position: 'absolute',
        top: 4,
        right: 4,
        padding: 4
    },
    name: {
        fontSize: 10,
        position: 'absolute',
        bottom: 4
    }
})