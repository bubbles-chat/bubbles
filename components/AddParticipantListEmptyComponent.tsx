import { StyleSheet, View } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from './ThemedText'

const AddParticipantListEmptyComponent = () => {
    const textColor = useThemeColor({}, 'text') as string

    return (
        <View style={styles.container}>
            <Ionicons
                name='person'
                color={textColor}
                size={100}
            />
            <ThemedText>No available connections to add</ThemedText>
        </View>
    )
}

export default AddParticipantListEmptyComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})