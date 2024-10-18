import { StyleSheet, useColorScheme, View } from 'react-native'
import { ThemedText } from './ThemedText'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

const ConnectionsListEmptyComponent = () => {
    const textColor = useColorScheme() === 'dark' ? Colors.dark.text : Colors.light.text

    return (
        <View style={styles.container}>
            <MaterialIcons
                name='person-remove'
                color={textColor}
                size={100}
            />
            <ThemedText>You don't have any connections</ThemedText>
        </View>
    )
}

export default ConnectionsListEmptyComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})