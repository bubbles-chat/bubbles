import { GestureResponderEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, TextInputFocusEventData, useColorScheme, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import CustomTextInput from '@/components/CustomTextInput'
import { InputState } from '@/types/types'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import ThemedLinearGradient from '@/components/ThemedLinearGradient'
import { useHeaderHeight } from '@react-navigation/elements'

const SignUp = () => {
    const [email, setEmail] = useState<InputState>({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [password, setPassword] = useState<InputState>({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [confirmPassword, setConfirmPassword] = useState<InputState>({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })

    const headerHeight = useHeaderHeight()

    const colorScheme = useColorScheme()

    const iconColor = useMemo(() => colorScheme === 'dark' ? Colors.dark.text : Colors.light.text, [colorScheme])

    const handleEmailOnChangeText = (text: string): void => {
        setEmail((prev: InputState): InputState => ({
            ...prev,
            value: text
        }))
    }

    const handleEmailOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
        setEmail((prev: InputState): InputState => ({
            ...prev,
            isFocused: true
        }))
    }

    const handleEmailOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
        setEmail((prev: InputState): InputState => ({
            ...prev,
            isFocused: false
        }))
    }

    const handlePasswordOnChangeText = (text: string): void => {
        setPassword((prev: InputState): InputState => ({
            ...prev,
            value: text
        }))
    }

    const handlePasswordOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
        setPassword((prev: InputState): InputState => ({
            ...prev,
            isFocused: true
        }))
    }

    const handleConfirmPasswordOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
        setPassword((prev: InputState): InputState => ({
            ...prev,
            isFocused: false
        }))
    }

    const handleConfirmPasswordOnChangeText = (text: string): void => {
        setConfirmPassword((prev: InputState): InputState => ({
            ...prev,
            value: text
        }))
    }

    const handleConfirmPasswordOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
        setConfirmPassword((prev: InputState): InputState => ({
            ...prev,
            isFocused: true
        }))
    }

    const handlePasswordOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
        setConfirmPassword((prev: InputState): InputState => ({
            ...prev,
            isFocused: false
        }))
    }

    const handleSignUpOnPress = (e: GestureResponderEvent): void => {
        console.log('hello signup');
    }

    const handleSignInOnPress = () => {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.replace('/(auth)')
        }
    }

    return (
        <ThemedLinearGradient style={[styles.container, { paddingTop: headerHeight + 16 }]}>
            <CustomTextInput
                state={email}
                hasValidation={true}
                placeholder="E-mail"
                Icon={<AntDesign
                    name="mail"
                    size={18}
                    color={email.validation?.isValid ? iconColor : 'red'}
                />}
                onChangeText={handleEmailOnChangeText}
                onFocus={handleEmailOnFocus}
                onBlur={handleEmailOnBlur}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <View style={styles.separator} />
            <CustomTextInput
                state={password}
                placeholder="Password"
                hasValidation={true}
                secureTextEntry={true}
                Icon={<MaterialIcons
                    name="password"
                    size={18}
                    color={password.validation?.isValid ? iconColor : 'red'}
                />}
                onChangeText={handlePasswordOnChangeText}
                onBlur={handlePasswordOnBlur}
                onFocus={handlePasswordOnFocus}
                autoCapitalize="none"
            />
            <View style={styles.separator} />
            <CustomTextInput
                state={confirmPassword}
                placeholder="Confirm password"
                hasValidation={true}
                secureTextEntry={true}
                Icon={<MaterialIcons
                    name="password"
                    size={18}
                    color={confirmPassword.validation?.isValid ? iconColor : 'red'}
                />}
                onChangeText={handleConfirmPasswordOnChangeText}
                onBlur={handleConfirmPasswordOnBlur}
                onFocus={handleConfirmPasswordOnFocus}
                autoCapitalize="none"
            />
            <View style={styles.separator} />
            <CustomButton
                text='Sign up'
                onPress={handleSignUpOnPress}
            />
            <View style={styles.separator} />
            <Pressable style={styles.pressable} onPress={handleSignInOnPress}>
                <ThemedText>Already have an account? <Text style={styles.secondryText}>Sign in</Text></ThemedText>
            </Pressable>
        </ThemedLinearGradient>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8
    },
    separator: {
        height: 20
    },
    secondryText: {
        textDecorationLine: 'underline',
        color: '#6d6d6d'
    },
    pressable: {
        padding: 8
    }
})