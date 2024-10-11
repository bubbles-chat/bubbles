import User from "./User.model"

export default interface NotificationToken {
    _id: string
    userId: User | string
    token: string
}