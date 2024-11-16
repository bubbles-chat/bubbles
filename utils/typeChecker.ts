import Chat from "@/models/Chat.model";
import User from "@/models/User.model";

export const isUser = (user: User | string): user is User => {
    return typeof user !== 'string'
}

export const isUserArray = (connections: User[] | string[]): connections is User[] => {
    return connections.length > 0 && typeof connections[0] !== 'string'
}

export const isChatArray = (chats: Chat[] | string[]): chats is Chat[] => {
    return chats.length > 0 && typeof chats[0] !== 'string'
}

export const isChat = (chat: string | Chat): chat is Chat => {
    return typeof chat !== 'string'
}