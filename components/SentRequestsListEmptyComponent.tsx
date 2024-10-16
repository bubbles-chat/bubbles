import { StyleSheet, useColorScheme, View } from 'react-native'
import { ThemedText } from './ThemedText'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

const SentRequestsListEmptyComponent = () => {
    const textColor = useColorScheme() === 'dark' ? Colors.dark.text : Colors.light.text

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons
                name='email-check-outline'
                color={textColor}
                size={100}
            />
            <ThemedText>You don't have sent requests</ThemedText>
        </View>
    )
}

export default SentRequestsListEmptyComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})