import Participant from "@/models/Participant.model";

export interface ChatUserAddedPayload {
    chatId: string
    participant: Participant
}

export interface ChatUserRemovedPayload {
    chatId: string
    userId: string
}

export interface ChatUserRoleChanged {
    chatId: string
    userId: string
}