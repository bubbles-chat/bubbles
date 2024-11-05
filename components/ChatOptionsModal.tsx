import { BlurView } from 'expo-blur';
import { Modal, ModalProps, StyleSheet, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'

const ChatOptionsModal = ({ visible, onRequestClose, options = [], ...rest }: ModalProps & { options?: React.JSX.Element[] }) => {
    const colorScheme = useColorScheme()
    const headerHeight = useHeaderHeight()

    const handleModalTap = () => {
        // Do nothing when tapped inside the modal
    };

    return (
        <Modal
            animationType='fade'
            onRequestClose={onRequestClose}
            transparent={true}
            visible={visible}
            {...rest}
        >
            <TouchableWithoutFeedback onPress={onRequestClose}>
                <View style={[styles.container, { top: headerHeight }]}>
                    <TouchableWithoutFeedback onPress={handleModalTap}>
                        <View style={styles.centeredView}>
                            <BlurView
                                experimentalBlurMethod='dimezisBlurView'
                                intensity={80}
                                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                                style={styles.modalView}
                            >
                                {options.map(option => option)}
                            </BlurView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default ChatOptionsModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-end',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        borderRadius: 10,
        padding: 8,
        alignItems: "flex-start",
        elevation: 5,
        overflow: 'hidden'
    }
})