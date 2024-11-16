import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native'
import Participant from '@/models/Participant.model'
import { isUser } from '@/utils/typeChecker'
import { ThemedText } from './ThemedText'
import { useAppSelector } from '@/hooks/useAppSelector'
import { PADDING_HORIZONTAL } from '@/constants/Dimensions'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import CustomModal from './CustomModal'
import CustomButton from './CustomButton'
import { useState } from 'react'

const ParticipantFlatListItem = ({
    item,
    showOptionsBtn,
    onPressYesRemove,
    onPressMakeAnAdmin
}: {
    item: Participant,
    showOptionsBtn: boolean,
    onPressYesRemove: () => any,
    onPressMakeAnAdmin: () => any
}) => {
    if (isUser(item.user)) {
        const { user } = useAppSelector(state => state.user)
        const textColor = useThemeColor({}, 'text') as string
        const [actionModalVisible, setActionModalVisible] = useState(false)
        const [confirmRemoveModalVisible, setConfirmRemoveModalVisible] = useState(false)
        const [isLoading, setIsLoading] = useState(false)

        const onPressOptionBtn = () => {
            setActionModalVisible(true)
        }

        const onRequestCloseActionModal = () => {
            setActionModalVisible(false)
        }

        const onRequestCloseConfirmRemoveModal = () => {
            setConfirmRemoveModalVisible(false)
        }

        const onPressRemoveFromChat = () => {
            setActionModalVisible(false)
            setConfirmRemoveModalVisible(true)
        }

        const onPressYesConfirmRemove = async () => {
            setIsLoading(true)
            await onPressYesRemove()
            setConfirmRemoveModalVisible(false)
            setIsLoading(false)
        }

        const onPressMakeAnAdminCallBack = async () => {
            setIsLoading(true)
            await onPressMakeAnAdmin()
            setActionModalVisible(false)
            setIsLoading(false)
        }

        return (
            <View style={styles.container}>
                {/* options modal */}
                <CustomModal visible={actionModalVisible} onRequestClose={onRequestCloseActionModal}>
                    <ThemedText style={styles.modalTitle}>Choose an action for {item.user.displayName}</ThemedText>
                    <View style={styles.separator} />
                    <Pressable style={styles.optionBtn} onPress={onPressRemoveFromChat}>
                        <Ionicons
                            name='person-remove'
                            color={textColor}
                            size={18}
                        />
                        <ThemedText>Remove from chat</ThemedText>
                    </Pressable>
                    <View style={styles.separator} />
                    <Pressable style={styles.optionBtn} onPress={onPressMakeAnAdminCallBack}>
                        <MaterialIcons
                            name='admin-panel-settings'
                            color={textColor}
                            size={18}
                        />
                        <ThemedText>Make an admin</ThemedText>
                    </Pressable>
                    <View style={styles.separator} />
                    {isLoading ? <ActivityIndicator size={'large'} /> : <CustomButton
                        text='cancel'
                        hasBackground={false}
                        onPress={onRequestCloseActionModal}
                    />}
                </CustomModal>
                {/* confirm remove user modal */}
                <CustomModal visible={confirmRemoveModalVisible} onRequestClose={onRequestCloseConfirmRemoveModal}>
                    <ThemedText>Would you like to remove {item.user.displayName} from the chat?</ThemedText>
                    <View style={styles.separator} />
                    {isLoading ? <ActivityIndicator size={'large'} /> : <View style={styles.modalBtnsView}>
                        <CustomButton
                            text='No'
                            hasBackground={false}
                            onPress={onRequestCloseConfirmRemoveModal}
                        />
                        <CustomButton
                            text='Yes'
                            onPress={onPressYesConfirmRemove}
                        />
                    </View>}
                </CustomModal>
                <Image
                    style={styles.image}
                    source={item.user.photoURL.length > 0 ? { uri: item.user.photoURL } : require('@/assets/images/avatar.png')}
                />
                {user?._id === item.user._id ? <ThemedText>You</ThemedText> : <ThemedText>{item.user.displayName}</ThemedText>}
                <View style={styles.optionsView}>
                    {!item.isAdmin && showOptionsBtn ? <Pressable onPress={onPressOptionBtn}>
                        <Entypo
                            name='dots-three-horizontal'
                            color={textColor}
                            size={18}
                        />
                    </Pressable> :
                        item.isAdmin ? <ThemedText style={styles.adminText}>Admin</ThemedText> :
                            null}
                </View>
            </View>
        )
    }

    return <ThemedText>Invalid item.user format</ThemedText>
}

export default ParticipantFlatListItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        gap: 8
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: 'lightgrey'
    },
    optionsView: {
        position: 'absolute',
        right: PADDING_HORIZONTAL
    },
    adminText: {
        color: 'green'
    },
    modalTitle: {
        fontWeight: 'bold'
    },
    optionBtn: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start'
    },
    separator: {
        height: 8
    },
    modalBtnsView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})