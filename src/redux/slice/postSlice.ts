import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Post {
    id: string;
    title: string;
    category: string;
    content: any;
    author: string;
    createdAt: string;
    updatedAt: string;
}

interface PostState {
    post:   Post | null;
    status: "idle";
    error: null;
}

const initialState: PostState = {
    post: null ,
    status: "idle",
    error: null
};

export const fetchPostByTitle = createAsyncThunk('posts/fetchPostByTitle', async (title: string) => {
    const response = await api.get(`v1/blog/post/title/${title}/`);
    return response.data;
})

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostByTitle.rejected, (state: any, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch post.";
            })
            .addCase(fetchPostByTitle.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(fetchPostByTitle.fulfilled, (state: any, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
    },
});

export default postSlice.reducer;
