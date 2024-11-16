import CustomTextInput from "@/components/CustomTextInput";
import { useState } from "react";
import { GestureResponderEvent, Image, NativeSyntheticEvent, PermissionsAndroid, Pressable, StyleSheet, Text, TextInputFocusEventData, View } from "react-native";
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { InputState } from "@/types/types";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import ThemedLinearGradient from "@/components/ThemedLinearGradient";
import Loading from "@/components/Loading";
import { validateEmail } from "@/utils/inputValidation";
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getUserByEmailAsync } from "@/store/userAsyncThunks";
import messaging from '@react-native-firebase/messaging'
import { addToken } from "@/api/notificationTokenApi";
import { updateAuthHeaders } from "@/utils/jwt";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
})

export default function Index() {
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const dispatch = useAppDispatch()

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

  const handlePasswordOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    setPassword((prev: InputState): InputState => ({
      ...prev,
      isFocused: false
    }))
  }

  const handleSignInOnPress = async (e: GestureResponderEvent): Promise<void> => {
    setIsLoading(true)
    try {
      const emailValidationResult = validateEmail(email.value)

      setEmail((prev: InputState): InputState => ({
        ...prev,
        isFocused: false,
        validation: emailValidationResult
      }))

      if (emailValidationResult.isValid) {
        await auth().signInWithEmailAndPassword(email.value, password.value)
        await updateAuthHeaders()

        if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)) {
          await messaging().registerDeviceForRemoteMessages()

          const notificationToken = await messaging().getToken()

          await addToken(notificationToken)
        }

        dispatch(getUserByEmailAsync({ email: auth().currentUser?.email as string }))
        setError(null)
      }
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInWIthGoogleOnPress = async (e: GestureResponderEvent): Promise<void> => {
    setIsLoading(true)
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

      const { data } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken as string | null)

      await auth().signInWithCredential(googleCredential)
      await updateAuthHeaders()

      const email = auth().currentUser?.email as string

      if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)) {
        await messaging().registerDeviceForRemoteMessages()

        const notificationToken = await messaging().getToken()
        console.log('fcm token:', notificationToken);

        await addToken(notificationToken)
      }

      dispatch(getUserByEmailAsync({ email }))
    } catch (e) {
      console.log(e);

      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassowrdOnPress = () => {
    router.push('/(auth)/forgotPassword')
  }

  const handleSignUpOnPress = () => {
    router.push('/(auth)/signUp')
  }

  return (
    <ThemedLinearGradient style={styles.container}>
      <Loading visible={isLoading} />
      <View style={styles.iconView}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.icon}
        />
      </View>
      <View style={styles.separator} />
      <CustomTextInput
        state={email}
        hasValidation={true}
        placeholder="E-mail"
        Icon={<AntDesign
          name="mail"
          size={18}
          color={email.validation?.isValid ? '#fff' : 'red'}
        />}
        onChangeText={handleEmailOnChangeText}
        onFocus={handleEmailOnFocus}
        onBlur={handleEmailOnBlur}
        keyboardType="email-address"
        autoCapitalize="none"
        customBorderColor="#fff"
        customTextColor="#fff"
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
          color={password.validation?.isValid ? "#fff" : 'red'}
        />}
        onChangeText={handlePasswordOnChangeText}
        onBlur={handlePasswordOnBlur}
        onFocus={handlePasswordOnFocus}
        autoCapitalize="none"
        customBorderColor="#fff"
        customTextColor="#fff"
      />
      {error && <Text style={styles.errorMessage}>Invalid credential</Text>}
      <Pressable style={styles.pressable} onPress={handleForgotPassowrdOnPress}>
        <ThemedText style={styles.secondryText}>Forgot password?</ThemedText>
      </Pressable>
      <View style={styles.separator} />
      <CustomButton
        onPress={handleSignInOnPress}
        text="Sign in"
        customBackgroundColor="#000"
        customTextColor="#fff"
      />
      <ThemedText style={styles.orText}>Or</ThemedText>
      <CustomButton
        onPress={handleSignInWIthGoogleOnPress}
        text="Sign in with Google"
        Icon={<AntDesign name="google" size={20} color={"#fff"} />}
        customBackgroundColor="#000"
        customTextColor="#fff"
      />
      <View style={styles.separator} />
      <Pressable style={styles.pressable} onPress={handleSignUpOnPress}>
        <ThemedText style={styles.text}>Don't have an account? <Text style={styles.secondryText}>Sign up</Text></ThemedText>
      </Pressable>
    </ThemedLinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8
  },
  separator: {
    height: 20
  },
  secondryText: {
    textDecorationLine: "underline",
    color: '#fff'
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff'
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 16
  },
  iconView: {
    width: '100%',
    alignItems: 'center'
  },
  pressable: {
    padding: 8
  },
  errorMessage: {
    color: 'red'
  },
  text: {
    color: '#fff'
  }
})
