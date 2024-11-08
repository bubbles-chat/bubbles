import { AxiosResponse } from "axios";
import client from "./client";
import Chat from "@/models/Chat.model";
import User from "@/models/User.model";

export async function createGroupChat(chatName: string): Promise<AxiosResponse<{
    message: string,
    chat: Chat,
    user: User
}>> {
    return await client.post('/chat/createGroupChat', {
        chatName
    })
}

export async function addUserToGroupChat(chatId:string, userId: string): Promise<AxiosResponse<{message: string, chat: Chat}>> {
    return await client.put(`/chat/addUserToGroupChat/${userId}/${chatId}`)
}