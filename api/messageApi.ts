import Message from "@/models/Message.model";
import axios, { AxiosResponse } from "axios";
import client from "./client";
import { updateAuthHeaders } from "@/utils/jwt";
import FormData from 'form-data';
import auth from '@react-native-firebase/auth'

export async function getMessages(chatId: string, limit: number, skip: number): Promise<AxiosResponse<{ message: string, messages: Message[] }>> {
    await updateAuthHeaders()
    return await client.get(`/message/getMessages/${chatId}?limit=${limit}&skip=${skip}`)
}

export async function getMessage(id: string): Promise<AxiosResponse<{ message: Message }>> {
    await updateAuthHeaders()
    return await client.get(`/message/getMessage/${id}`)
}

export async function uploadAttachment(data: FormData, chatId: string): Promise<AxiosResponse<{
    message: string,
    data?: {
        url: string,
        public_id: string,
        type: string
    }
}>> {
    const token = await auth().currentUser?.getIdToken()

    return await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/message/uploadAttachment/${chatId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    })
}