import User from "@/models/User.model";

export const isUser = (user: User | string): user is User => {
    return typeof user !== 'string'
}

export const isUserArray = (connections: User[] | string[]): connections is User[] => {
    return connections.length > 0 && typeof connections[0] !== 'string'
}