import { ReactNode } from "react"
import { TextInputProps, TouchableOpacityProps, ViewProps } from "react-native"

export interface CustomTextInputProps extends TextInputProps {
    Icon?: ReactNode
    hasValidation?: boolean
    state: InputState
    lightBorderColor?: string
    darkBorderColor?: string
}

export interface InputState {
    value: string
    isFocused: boolean
    validation?: {
        isValid: boolean
        message: string
    }
}

export interface CustomButtonProps extends TouchableOpacityProps {
    text?: string
    Icon?: ReactNode
    lightBackground?: string
    darkBackground?: string
}

export interface ThemedLinearGradientProps extends ViewProps {
    lightGradient?: string[]
    darkGradient?: string[]
}