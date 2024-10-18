import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Request from '@/models/Request.model'
import User from '@/models/User.model'
import { ThemedText } from './ThemedText'
import { useState } from 'react'

const SentRequestFlatListItem = ({ item, onPressCancel }: { item: Request, onPressCancel: () => Promise<void> }) => {
    const [isLoading, setIsLoading] = useState(false)

    const receiverIsUser = (receiver: User | string): receiver is User => {
        return typeof receiver !== 'string';
    }

    const handleOnCancelPress = async () => {
        setIsLoading(true)
        await onPressCancel()
        setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            {receiverIsUser(item.receiver) ?
                <>
                    <Image
                        source={item.receiver.photoURL?.length === 0
                            ? require('@/assets/images/avatar.png')
                            : { uri: item.receiver.photoURL }}
                        style={styles.image}
                    />
                    <ThemedText>{item.receiver.displayName}</ThemedText>
                    {isLoading ?
                        <ActivityIndicator
                            size='large'
                            style={styles.cancelBtn}
                        />
                        :
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleOnCancelPress}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>}
                </>
                :
                <ThemedText>No receiver information available</ThemedText>
            }
        </View>
    )
}

export default SentRequestFlatListItem

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 8,
        backgroundColor: 'lightgrey'
    },
    cancelBtn: {
        position: 'absolute',
        right: 8,
        padding: 8
    },
    cancelText: {
        color: 'red'
    }
})
