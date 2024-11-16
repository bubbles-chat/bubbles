import Message from "./Message.model";
import Participant from "./Participant.model";

export default interface Chat {
    _id: string
    participants: Participant[]
    lastMessage: Message | string
    type: string
    chatName?: string
    photoUrl: string
    updatedAt: string
    createdAt: string
}