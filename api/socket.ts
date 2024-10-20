import { io } from "socket.io-client";

const socket = io(process.env.EXPO_PUBLIC_API_URL, {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000
})

export default socket