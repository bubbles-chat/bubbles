import { AxiosResponse } from "axios";
import client from "./client";
import NotificationToken from "@/models/NotificationToken.model";

export async function addToken(token: string): Promise<AxiosResponse<{ message: string, token: NotificationToken }>> {
    return await client.post(`/notificationToken/addToken/${token}`)
}