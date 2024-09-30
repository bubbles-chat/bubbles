import { NativeSyntheticEvent, StyleSheet, TextInputFocusEventData, useColorScheme, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { InputState } from '@/types/types'
import CustomTextInput from '@/components/CustomTextInput'
import { AntDesign } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { Colors } from '@/constants/Colors'
import ThemedLinearGradient from '@/components/ThemedLinearGradient'
import { useHeaderHeight } from '@react-navigation/elements'

const ForgotPassword = () => {
  const [email, setEmail] = useState<InputState>({
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

  return (
    <ThemedLinearGradient style={{ ...styles.container, paddingTop: headerHeight + 16 }}>
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