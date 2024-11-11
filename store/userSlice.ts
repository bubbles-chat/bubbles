import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addUserAsync, createGroupChatAsync, getUserByEmailAsync, signOutAsync } from "./userAsyncThunks";
import User from "@/models/User.model";
import Chat from "@/models/Chat.model";
import { isChatArray } from "@/utils/typeChecker";

interface UserState {
    user: User | null
}

const initialState: UserState = {
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addChat: (state, action: PayloadAction<Chat>) => {
            if (state.user && isChatArray(state.user.chats)) {
                state.user.chats = [action.payload, ...state.user.chats]
            }
        },
        removeChat: (state, action: PayloadAction<string>) => {
            if (state.user && isChatArray(state.user.chats)) {
                state.user.chats = state.user.chats.filter(chat => chat._id !== action.payload)
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addUserAsync.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addCase(getUserByEmailAsync.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addCase(signOutAsync.fulfilled, (state, _) => {
            state.user = null
        })

        builder.addCase(createGroupChatAsync.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload
            }
        })
    }
})

export const { addChat, removeChat } = userSlice.actions
export default userSlice.reducer