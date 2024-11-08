import { AxiosResponse } from "axios";
import client from "./client";
import Chat from "@/models/Chat.model";
import User from "@/models/User.model";
import { updateAuthHeaders } from "@/utils/jwt";

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