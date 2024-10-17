import Request from "@/models/Request.model";
import { AxiosResponse } from "axios";
import client from "./client";

export async function addRequest(reveiver: string): Promise<AxiosResponse<{ message: string, request?: Request }>> {
    return await client.post(`/request/addRequest/${reveiver}`)
}

export async function getSentRequests(): Promise<AxiosResponse<{ message: string, requests?: Request[] }>> {
    return await client.get('/request/getSentRequests')
}

export async function cancelRequest(id: string): Promise<AxiosResponse<{ message: string, request?: Request }>> {
    return await client.delete(`/request/deleteRequest/${id}`)
}

export async function getPendingRequests(): Promise<AxiosResponse<{ message: string, requests?: Request[] }>> {
    return await client.get('/request/getPendingRequests')
}