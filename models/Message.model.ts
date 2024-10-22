import Chat from "./Chat.model";
import User from "./User.model";

export default interface Message {
    _id: string
    chatId: Chat | string
    sender: User | string
    text: string
    attachmentsUrl: string[]
    createdAt: Date
    updatedAt: Date
}