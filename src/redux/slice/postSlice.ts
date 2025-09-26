import api from "@/src/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Post {
    id: string;
    title: string;
    category: string;
    content: any;
    author: string;
    createdAt: string;
    updatedAt: string;
    image_links: string;
    tags?: string[];
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
    reducers: {
        setPost: (state, action: PayloadAction<Post>) => {
          state.post = action.payload;
        },
    },
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

export const { setPost } = postSlice.actions;
export default postSlice.reducer;
