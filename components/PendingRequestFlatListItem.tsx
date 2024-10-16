import Request from '@/models/Request.model';
import User from '@/models/User.model';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ThemedText } from './ThemedText';

const PendingRequestFlatListItem = ({
    item,
    onPressAccept,
    onPressReject
}: {
    item: Request,
    onPressAccept: () => Promise<void>,
    onPressReject: () => Promise<void>
}) => {
    const [isLoading, setIsLoading] = useState(false)

    const senderIsUser = (sender: User | string): sender is User => {
        return typeof sender !== 'string';
    }

    const handleOnPressReject = async () => {
        setIsLoading(true)
        await onPressReject()
        setIsLoading(false)
    }

    const handleOnPressAccept = async () => {
        setIsLoading(true)
        await onPressAccept()
        setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            {senderIsUser(item.sender) ?
                <>
                    <Image
                        source={item.sender.photoURL?.length === 0
                            ? require('@/assets/images/avatar.png')
                            : { uri: item.sender.photoURL }}
                        style={styles.image}
                    />
                    <ThemedText>{item.sender.displayName}</ThemedText>
                    {isLoading ?
                        <ActivityIndicator
                            size='large'
                            style={styles.rejectBtn}
                        />
                        :
                        <View style={styles.btnsView}>
                            <TouchableOpacity style={styles.rejectBtn} onPress={handleOnPressReject}>
                                <Text style={styles.rejectText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptBtn} onPress={handleOnPressAccept}>
                                <Text style={styles.acceptText}>Accept</Text>
                            </TouchableOpacity>
                        </View>}
                </>
                :
                <ThemedText>No sender information available</ThemedText>
            }
        </View>
    )
}

export default PendingRequestFlatListItem

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
    btnsView: {
        flexDirection: 'row',
        position: 'absolute',
        right: 8
    },
    rejectBtn: {
        padding: 8
    },
    rejectText: {
        color: 'red'
    },
    acceptBtn: {
        padding: 8
    },
    acceptText: {
        color: 'green'
    }
})