import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SecondUserState {
    userId: string;
    userName: string;
    userEmail: string;
    status: string;
}


const  secondUserInitialState: SecondUserState = {
    userId: "",
    userName: "", 
    userEmail: "",
    status: ""
};


export const getUserDetails = createAsyncThunk('user/updateUserProfile', async (data: {username: string, token: string} ) => {
    const headers = {
        Authorization: "Bearer " + data.token
    };
    const response = await api.get(`v1/user/${data.username}`, { headers });
    return response.data;
});

const secondUserSlice = createSlice({
    name: "secondUser",
    initialState: secondUserInitialState,
    reducers: {
        clearSecondUserState(state) {
            state.userId = "";
            state.userName = "";
            state.userEmail = "";
            state.status = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.userId = action.payload.userId;
                state.userName = action.payload.userName;
                state.userEmail = action.payload.userEmail;
                state.status = "fulfilled";
            })
            .addCase(getUserDetails.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getUserDetails.rejected, (state) => {
                state.status = "rejected";
            });
    }
});

export const { clearSecondUserState } = secondUserSlice.actions;
export default secondUserSlice.reducer;
