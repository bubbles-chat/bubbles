import { StyleSheet, useColorScheme } from 'react-native'
import { BlurView, BlurViewProps } from 'expo-blur'

const BlurViewContainer = (props: BlurViewProps) => {
    const colorScheme = useColorScheme()

    return (
        <BlurView
            style={styles.container}
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            blurReductionFactor={4}
            // experimentalBlurMethod='dimezisBlurView'
            {...props} />
    )
}

export default BlurViewContainer

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})