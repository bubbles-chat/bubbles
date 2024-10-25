import { AxiosResponse } from "axios";
import client from "./client";
import NotificationToken from "@/models/NotificationToken.model";
import { updateAuthHeaders } from "@/utils/jwt";

export async function addToken(token: string): Promise<AxiosResponse<{ message: string, token: NotificationToken }>> {
    await updateAuthHeaders()
    return await client.post(`/notificationToken/addToken/${token}`)
}

export async function deleteToken(token: string): Promise<AxiosResponse<{ message: string }>> {
    await updateAuthHeaders()
    return await client.delete(`/notificationToken/deleteToken/${token}`)
}