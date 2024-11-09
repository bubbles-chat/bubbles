import Message from "@/models/Message.model";
import Participant from "@/models/Participant.model";

export interface ChatUserAddedPayload {
    chatId: string
    participant: Participant
}

export interface ChatUserRemovedPayload {
    chatId: string
    userId: string
}

export interface ChatUserRoleChangedPayload {
    chatId: string
    userId: string
}

export interface ChatMessageAddedPayload {
    chatId: string
    message: Message
}

export interface ChatMessageEditedPayload {
    text: string
    id: string
}

export interface ChatPhotoUpdatedPayload {
    chatId: string
    url: string
}