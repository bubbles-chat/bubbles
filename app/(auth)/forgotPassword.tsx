import { Alert, NativeSyntheticEvent, StyleSheet, TextInputFocusEventData, useColorScheme, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { InputState } from '@/types/types'
import CustomTextInput from '@/components/CustomTextInput'
import { AntDesign } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { Colors } from '@/constants/Colors'
import ThemedLinearGradient from '@/components/ThemedLinearGradient'
import { useHeaderHeight } from '@react-navigation/elements'
import { validateEmail } from '@/utils/inputValidation'
import auth from '@react-native-firebase/auth'
import Loading from '@/components/Loading'
import { router } from 'expo-router'

const ForgotPassword = () => {
  const [email, setEmail] = useState<InputState>({
    value: '',
    isFocused: false,
    validation: {
      isValid: true,
      message: ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
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
      isFocused: false,
      validation: validateEmail(email.value)
    }))
  }

  const handleSendEmailOnPress = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const emailValidationResult = validateEmail(email.value)

      setEmail((prev: InputState): InputState => ({
        ...prev,
        validation: emailValidationResult
      }))

      if (emailValidationResult.isValid) {
        await auth().sendPasswordResetEmail(email.value)
        Alert.alert('Please check your E-mail', 'Follow the link sent in the E-mail', [{
          text: 'OK',
          style: 'default',
          onPress: () => router.back()
        }])
      }
    } catch (error) {
      Alert.alert('Somtheing went wrong', 'Try again later', [{
        text: 'OK',
        style: 'default'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemedLinearGradient style={{ ...styles.container, paddingTop: headerHeight + 16 }}>
      <Loading visible={isLoading} />
      <CustomTextInput
        state={email}
        hasValidation={true}
        placeholder="E-mail"
        Icon={<AntDesign name="mail" size={18} color={iconColor} />}
        onChangeText={handleEmailOnChangeText}
        onFocus={handleEmailOnFocus}
        onBlur={handleEmailOnBlur}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.separator} />
      <CustomButton
        text='Send E-mail'
        onPress={handleSendEmailOnPress}
      />
    </ThemedLinearGradient>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
  },
  separator: {
    height: 20
  }
})