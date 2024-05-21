import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

interface PostState {
    posts: Post[];
    status: string;
    error: string | null;
}

const initialState: PostState = {
    posts: [],
    status: "idle",
    error: null,
};

// Thunk to fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get('/api/posts');
    return response.data;
});

// Thunk to create a new post
export const createPost = createAsyncThunk('posts/createPost', async (newPost: { title: string; content: string; author: string }) => {
    const response = await axios.post('/api/posts', newPost);
    return response.data;
});

// Thunk to update an existing post
export const updatePost = createAsyncThunk('posts/updatePost', async (updatedPost: { id: string; title: string; content: string }) => {
    const response = await axios.put(`/api/posts/${updatedPost.id}`, updatedPost);
    return response.data;
});

// Thunk to delete a post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId: string) => {
    await axios.delete(`/api/posts/${postId}`);
    return postId;
});

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch posts
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch posts.";
            })
            // Create post
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts.push(action.payload);
            })
            .addCase(createPost.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to create post.";
            })
            // Update post
            .addCase(updatePost.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.posts.findIndex(post => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(updatePost.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to update post.";
            })
            // Delete post
            .addCase(deletePost.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts = state.posts.filter(post => post.id !== action.payload);
            })
            .addCase(deletePost.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to delete post.";
            });
    },
});

export default postSlice.reducer;
