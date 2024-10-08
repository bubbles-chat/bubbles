import { AxiosResponse } from "axios";
import client from "./client";
import User from "@/models/User.model";

export async function addUser(email: string, displayName: string, photoURL: string): Promise<AxiosResponse<{ message: string, user: User }>> {
    return await client.post('/user/addUser', {
        email, displayName, photoURL
    })
}

export async function getUserByEmail(email: string): Promise<AxiosResponse<{ message: string, user: User }>> {
    return await client.get(`/user/getUserByEmail/${email}`)
}

export async function getUserByUsername(username: string, limit: number, skip: number): Promise<AxiosResponse<{ message: string, users: User[] }>> {
    return await client.get(`/user/getUserByUsername/${username}?limit=${limit}&skip=${skip}`)
}