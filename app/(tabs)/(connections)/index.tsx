import { StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useHeaderHeight } from '@react-navigation/elements'
import { PADDING_TOP, TOP_BAR_HEIGHT } from '@/constants/Dimensions'

const YourConnections = () => {
    const { user } = useAppSelector(state => state.user)
    const headerHeight = useHeaderHeight()

    return (
        <ThemedView style={[styles.container, { paddingTop: headerHeight + TOP_BAR_HEIGHT + PADDING_TOP }]}>
            <ThemedText>Index</ThemedText>
        </ThemedView>
    )
}

export default YourConnections

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})