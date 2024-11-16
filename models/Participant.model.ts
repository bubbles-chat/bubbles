import User from "./User.model";

export default interface Participant {
    user: User | string
    isAdmin?: boolean
}