import { Colors } from "@/constants/Colors"
import { PADDING_TOP, TAB_BAR_HEIGHT } from "@/constants/Dimensions"
import { Appearance, StyleSheet } from "react-native"
import Toast from "react-native-root-toast"

const showToast = (message: string): void => {
    const colorScheme = Appearance.getColorScheme()

    Toast.show(message, {
        duration: Toast.durations.LONG,
        containerStyle: [
            styles.container,
            {
                backgroundColor: colorScheme === 'dark' ? Colors.light.background : Colors.dark.background
            }],
        textColor: colorScheme === 'dark' ? Colors.light.text : Colors.dark.text
    })
}

export default showToast

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        bottom: TAB_BAR_HEIGHT + PADDING_TOP
    }
})