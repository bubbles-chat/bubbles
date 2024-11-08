import { StyleSheet, useColorScheme } from 'react-native'
import { BlurView, BlurViewProps } from 'expo-blur'
import { useThemeColor } from '@/hooks/useThemeColor'

const BlurViewContainer = ({ enabled, children }: { enabled?: boolean } & BlurViewProps) => {
    const colorScheme = useColorScheme()
    const backgroundColor = enabled ? undefined : useThemeColor({}, 'background') as string

    return (
        <BlurView
            style={[styles.container, { backgroundColor }]}
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            blurReductionFactor={4}
            experimentalBlurMethod={enabled ? 'dimezisBlurView' : 'none'}
            children={children}
        />
    )
}

export default BlurViewContainer

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})