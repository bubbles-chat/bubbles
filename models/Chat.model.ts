import Message from "./Message.model";
import User from "./User.model";

export default interface Chat {
    _id: string
    participants: User[] | string[]
    lastMessage: Message | string
    type: string
    chatName: string
}