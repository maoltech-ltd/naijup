import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";





const initialState = {
    image: "",
    status: "idle",
    error: null,
};

// Thunk to create a new post
export const createImage = createAsyncThunk('posts/createImage', async (newImage: File) => {
    if(newImage instanceof File){
    const formData = new FormData();
    formData.append('file', newImage)
    const headers = {
        'Content-Type': 'multipart/form-data'
    }
    const response = await api.post('v1/file/', formData, {headers});
    return response.data;
    }
});


const imageSlice = createSlice({
    name: "image",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create image
            .addCase(createImage.fulfilled, (state: any, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
            .addCase(createImage.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(createImage.rejected, (state: any, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to create post.";
            })
    },
});

export default imageSlice.reducer;
