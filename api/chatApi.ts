import axios, { AxiosResponse } from "axios";
import client from "./client";
import Chat from "@/models/Chat.model";
import User from "@/models/User.model";
import { updateAuthHeaders } from "@/utils/jwt";
import auth from '@react-native-firebase/auth'

export async function createGroupChat(chatName: string): Promise<AxiosResponse<{
    message: string,
    chat: Chat,
    user: User
}>> {
    await updateAuthHeaders()
    return await client.post('/chat/createGroupChat', {
        chatName
    })
}

export async function addUserToGroupChat(chatId: string, userId: string): Promise<AxiosResponse<{ message: string, chat: Chat }>> {
    await updateAuthHeaders()
    return await client.put(`/chat/addUserToGroupChat/${userId}/${chatId}`)
}

export async function removeParticipantFromGroupChat(chatId: string, userId: string): Promise<
    AxiosResponse<{
        message: string,
        chat: Chat
    }>
> {
    await updateAuthHeaders()
    return await client.put(`/chat/removeParticipant/${userId}/${chatId}`)
}

export async function makeParticipantAnAdmin(chatId: string, userId: string): Promise<
    AxiosResponse<{
        message: string,
        chat: Chat
    }>
> {
    await updateAuthHeaders()
    return await client.put(`/chat/changeParticipantRoleToAdmin/${userId}/${chatId}`)
}

export async function changeGroupChatPhoto(data: FormData, chatId: string): Promise<AxiosResponse<{
    message: string,
    data?: {
        url: string,
        public_id: string,
        type: string
    }
}>> {
    const token = await auth().currentUser?.getIdToken()

    return await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/chat/changeGroupChatPhoto/${chatId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    })
}