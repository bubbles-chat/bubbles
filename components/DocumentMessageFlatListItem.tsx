import { StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from './ThemedText'

const DocumentMessageFlatListItem = ({ uri, type }: { uri: string, type: string }) => {
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
                <ThemedText>{type.split('/')[1]}</ThemedText>
            </View>
            <Ionicons
                name='download-outline'
                color={textColor}
                size={20}
            />
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
        justifyContent: 'space-between'
    },
})