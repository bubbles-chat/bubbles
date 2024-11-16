import { ReactNode } from "react"
import { ModalProps, TextInputProps, TouchableOpacityProps, ViewProps } from "react-native"

export interface CustomTextInputProps extends TextInputProps {
    Icon?: ReactNode
    hasValidation?: boolean
    state: InputState
    lightBorderColor?: string
    darkBorderColor?: string
    pressableIcon?: ReactNode
    pressableOnPress?: () => any
    customBorderColor?: string
    customTextColor?: string
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
    customBackgroundColor?: string
    customTextColor?: string
}

export interface ThemedLinearGradientProps extends ViewProps {
    lightGradient?: string[]
    darkGradient?: string[]
}

export interface LoadingProps extends ModalProps {
    lightColor?: string
    darkColor?: string
}

export interface AttachmentMessageFlatListItemProps {
    uri: string
    name: string
    doesExist: boolean
    progress: number
    isDownloading: boolean
    onPressDownload: () => any
    onPressOpen?: () => any
    onPressShare?: () => any
}

export interface AttachmentScreenFlatListItemProps {
    uri: string
    name: string
    mimeType: string
}