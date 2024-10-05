export interface User {
    _id: string,
    displayName: string,
    email: string,
    chats: string[],
    connections: string[],
    pendingRequests: string[],
    pendingRequestsSeen: boolean,
    photoURL: string,
    sentRequests: string[]
}