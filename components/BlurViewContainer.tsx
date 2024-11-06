import { StyleSheet, useColorScheme } from 'react-native'
import { BlurView } from 'expo-blur'
import { useThemeColor } from '@/hooks/useThemeColor'

const BlurViewContainer = ({ enabled }: { enabled?: boolean }) => {
    const colorScheme = useColorScheme()
    const backgroundColor = enabled ? undefined : useThemeColor({}, 'background') as string

    return (
        <BlurView
            style={[styles.container, { backgroundColor }]}
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            blurReductionFactor={4}
            experimentalBlurMethod={enabled ? 'dimezisBlurView' : 'none'}
        />
    )
}

export default BlurViewContainer

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})