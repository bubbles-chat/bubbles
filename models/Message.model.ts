import Chat from "./Chat.model";
import User from "./User.model";

export default interface Message {
    chatId: Chat | string,
    sender: User | string,
    text: string,
    attachmentsUrl: string[]
}