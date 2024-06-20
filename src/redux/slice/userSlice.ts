import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { headers } from "next/headers";


interface UserState {
    userId: string;
    userName: string;
    userEmail: string;
    token: string;
    isLoggedIn: boolean;
    status: string;
}

const initialState: UserState = {
    userId: "",
    userName: "",
    userEmail: "",
    token: "",
    status: "",
    isLoggedIn: false
}


export const fetchUser = createAsyncThunk('user/fetchUser', async (token: string) => {
    const headers = {
        Authorization: "Bearer " + token
    };
    const response = await api.post(`users/`, {}, { headers });
    return response.data;
});

// Thunk for user login
export const loginUser = createAsyncThunk('user/loginUser', async (credentials: { email: string, password: string }) => {
    const response = await api.post(`v1/user/auth/signin/`, credentials);
    return response.data;
});

// Thunk for user registration
export const registerUser = createAsyncThunk('user/registerUser', async (userInfo: { name: string, email: string, password: string }) => {
    const response = await api.post(`v1/user/auth/signup/`, userInfo);
    return response.data;
});

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async (userInfo: { userId: string, name: string, email: string, token: string }) => {
    const headers = {
        Authorization: "Bearer " + userInfo.token
    };
    const response = await api.put(`v1/user/${userInfo.userId}`, userInfo, { headers });
    console.log({response: response.data})
    return response.data;
});

// Thunk for refreshing token
export const refreshToken = createAsyncThunk('user/refreshToken', async (refreshToken: string) => {
    const response = await api.post(`v1/user/auth/refresh-token`, { token: refreshToken });
    return response.data;
});

  
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Reducer for logging out the user
        logoutUser(state) {
            state.userId = "";
            state.userName = "";
            state.userEmail = "";
            state.token = "";
            state.isLoggedIn = false;
            state.status = "";
        },
        // Reducer for clearing the state
        clearState(state) {
            state.userId = "";
            state.userName = "";
            state.userEmail = "";
            state.token = "";
            state.isLoggedIn = false;
            state.status = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.userId = action.payload.userId;
                state.userName = action.payload.userName;
                state.userEmail = action.payload.userEmail;
                state.token = action.payload.token;
                state.status = action.payload.status;
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(fetchUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchUser.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userId = action.payload.id;
                state.userName = action.payload.username;
                state.userEmail = action.payload.email;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.status = "fulfilled";
            })
            .addCase(loginUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.userId = action.payload.userId;
                state.userName = action.payload.userName;
                state.userEmail = action.payload.userEmail;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.status = "fulfilled";
            })
            .addCase(registerUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(registerUser.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.userName = action.payload.userName;
                state.userEmail = action.payload.userEmail;
                state.status = "fulfilled";
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.status = "pending";
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.status = "fulfilled";
            })
            .addCase(refreshToken.pending, (state) => {
                state.status = "pending";
            })
            .addCase(refreshToken.rejected, (state) => {
                state.status = "rejected";
            });
    }
});

export const { logoutUser, clearState } = userSlice.actions;
export default userSlice.reducer;