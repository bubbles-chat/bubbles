import Message from "@/models/Message.model";
import { AxiosResponse } from "axios";
import client from "./client";
import { updateAuthHeaders } from "@/utils/jwt";

export async function getMessages(chatId: string, limit: number, skip: number): Promise<AxiosResponse<{ message: string, messages: Message[] }>> {
    await updateAuthHeaders()
    return await client.get(`/message/getMessages/${chatId}?limit=${limit}&skip=${skip}`)
}