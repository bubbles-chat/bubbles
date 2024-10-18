import React from 'react'
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient'
import { ThemedLinearGradientProps } from '@/types/types'
import { useThemeColor } from '@/hooks/useThemeColor'

const ThemedLinearGradient: React.FC<ThemedLinearGradientProps> = (props) => {
    const colors = useThemeColor({ light: props.lightGradient, dark: props.darkGradient }, 'colors') as string[]

    return <LinearGradient
        colors={colors}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        {...props}
    />
}

export default ThemedLinearGradient