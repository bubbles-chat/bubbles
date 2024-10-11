import User from "./User.model";

export default interface Request {
    _id: string
    sender: User | string
    receiver: User | string
    status: string
    sentAt: Date
    respondedAt: Date
}