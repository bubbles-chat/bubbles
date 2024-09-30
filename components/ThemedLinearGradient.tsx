import React from 'react'
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient'
import { ThemedLinearGradientProps } from '@/types/types'
import { useThemeColor } from '@/hooks/useThemeColor'

const ThemedLinearGradient: React.FC<ThemedLinearGradientProps> = (props) => {
    const colors = useThemeColor({ light: props.lightGradient, dark: props.darkGradient }, 'colors') as string[]

    return <LinearGradient colors={colors} {...props} />
}

export default ThemedLinearGradient