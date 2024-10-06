import Chat from "./Chat.model"

export default interface User {
    _id: string,
    displayName: string,
    email: string,
    chats: Chat[] | string[],
    connections: User[] | string[],
    photoURL: string,
}