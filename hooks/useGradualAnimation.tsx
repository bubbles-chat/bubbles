import { PADDING_BOTTOM } from "@/constants/Dimensions";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

const useGradualAnimation = () => {
    const height = useSharedValue(8)

    useKeyboardHandler({
        onMove: e => {
            "worklet";
            height.value = Math.max(e.height, PADDING_BOTTOM)
        }
    }, [])

    return { height }
}

export default useGradualAnimation