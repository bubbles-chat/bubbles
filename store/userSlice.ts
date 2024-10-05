import { User } from "@/models/User.model";
import { createSlice } from "@reduxjs/toolkit";

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

    }
})

export default userSlice.reducer