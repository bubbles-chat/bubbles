import { createSlice } from "@reduxjs/toolkit";
import { addUserAsync, createGroupChatAsync, getUserByEmailAsync, signOutAsync } from "./userAsyncThunks";
import User from "@/models/User.model";

interface UserState {
    user: User | null
}

const initialState: UserState = {
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {}, // the reducers property is required by typescript even if it is empty
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

export default userSlice.reducer