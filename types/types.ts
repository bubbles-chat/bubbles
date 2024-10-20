import { ReactNode } from "react"
import { ModalProps, PressableProps, TextInputProps, TouchableOpacityProps, ViewProps } from "react-native"

export interface CustomTextInputProps extends TextInputProps {
    Icon?: ReactNode
    hasValidation?: boolean
    state: InputState
    lightBorderColor?: string
    darkBorderColor?: string
    pressableIcon?: ReactNode
    pressableOnPress?: () => any
}

export interface Validation {
    isValid: boolean
    message: string
}

export interface InputState {
    value: string
    isFocused: boolean
    validation?: Validation
}

export interface CustomButtonProps extends TouchableOpacityProps {
    text?: string
    Icon?: ReactNode
    lightBackground?: string
    darkBackground?: string
    hasBackground?: boolean
}

export interface ThemedLinearGradientProps extends ViewProps {
    lightGradient?: string[]
    darkGradient?: string[]
}

export interface LoadingProps extends ModalProps {
    lightColor?: string
    darkColor?: string
}