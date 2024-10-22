import client from '@/api/client'
import socket from '@/api/socket'
import auth from '@react-native-firebase/auth'

export const updateAuthHeaders = async () => {
    try {
        const token = await auth().currentUser?.getIdToken()
        const authHeader = `Bearer ${token}`
        client.defaults.headers.common['Authorization'] = authHeader
        socket.auth = {
            token: authHeader
        }
    } catch (e) {
        console.log('updateAuthHeaders', e);
    }
}