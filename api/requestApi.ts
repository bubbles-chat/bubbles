import Request from "@/models/Request.model";
import { AxiosResponse } from "axios";
import client from "./client";
import { updateAuthHeaders } from "@/utils/jwt";

export async function addRequest(reveiver: string): Promise<AxiosResponse<{ message: string, request?: Request }>> {
    await updateAuthHeaders()
    return await client.post(`/request/addRequest/${reveiver}`)
}

export async function getSentRequests(): Promise<AxiosResponse<{ message: string, requests?: Request[] }>> {
    await updateAuthHeaders()
    return await client.get('/request/getSentRequests')
}

export async function cancelRequest(id: string): Promise<AxiosResponse<{ message: string, request?: Request }>> {
    await updateAuthHeaders()
    return await client.delete(`/request/deleteRequest/${id}`)
}

export async function getPendingRequests(): Promise<AxiosResponse<{ message: string, requests?: Request[] }>> {
    await updateAuthHeaders()
    return await client.get('/request/getPendingRequests')
}

export async function rejectRequest(id: string): Promise<AxiosResponse<{ message: string, request?: Request }>> {
    await updateAuthHeaders()
    return await client.put(`/request/rejectRequest/${id}`)
}

export async function acceptRequest(id: string): Promise<AxiosResponse<{ message: string, request?: Request }>> {
    await updateAuthHeaders()
    return await client.put(`/request/acceptRequest/${id}`)
}