import { BlurView } from 'expo-blur';
import { Modal, StyleSheet, View, TouchableWithoutFeedback, ModalProps, useColorScheme } from 'react-native';

const CustomModal = ({ children, onRequestClose, visible, ...rest }: ModalProps) => {
    const colorScheme = useColorScheme()

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
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={handleModalTap}>
                        <View style={styles.centeredView}>
                            <BlurView
                                experimentalBlurMethod='dimezisBlurView'
                                intensity={80}
                                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                                style={styles.modalView}
                            >
                                {children}
                            </BlurView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5,
        overflow: 'hidden'
    }
});