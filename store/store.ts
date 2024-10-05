import { configureStore } from "@reduxjs/toolkit";
import userSlice from '@/store/userSlice'

export const store = configureStore({
    reducer: {
        user: userSlice
    }
})