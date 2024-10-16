import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



interface PostState {
    posts: []
    status: "idle";
    error: null;
}

const initialState: PostState = {
    posts: [] ,
    status: "idle",
    error: null,
};

// Thunk to fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await api.get('v1/blog/latest-posts/');
    return response.data;
});

export const fetchPost = createAsyncThunk('posts/fetchPost', async (postId: string) => {
    const response = await api.get(`/api/post/${postId}`);
    return response.data;
}) 

// Thunk to create a new post
export const createPost = createAsyncThunk('posts/createPost', async (payload: {post: any, token: string} ) => {
    const headers = {
        Authorization: "Bearer " + payload.token
    };
    const response = await api.post('v1/blog/', payload.post, {headers});
    return response.data;
});

// Thunk to update an existing post
export const updatePost = createAsyncThunk('posts/updatePost', async (updatedPost: { id: string; content: any }) => {
    const response = await api.put(`/api/post/${updatedPost.id}`, updatedPost);
    return response.data;
});

// Thunk to delete a post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId: string) => {
    await api.delete(`/api/posts/${postId}`);
    return postId;
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.fulfilled, (state: any, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
            .addCase(fetchPosts.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.rejected, (state: any, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch posts.";
            })
            // Create post
            .addCase(createPost.fulfilled, (state: any, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
            .addCase(createPost.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(createPost.rejected, (state: any, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to create post.";
            })
            // Update post
            .addCase(updatePost.fulfilled, (state: any, action) => {
                state.status = "succeeded";
                state.posts = action.payload; 
            })
            .addCase(updatePost.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(updatePost.rejected, (state: any, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to update post.";
            })
            // Delete post
            .addCase(deletePost.fulfilled, (state: any, action) => {
                state.status = "succeeded";
                state.posts = state.posts;
            })
            .addCase(deletePost.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(deletePost.rejected, (state: any, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to delete post.";
            })
            .addCase(fetchPost.rejected, (state: any, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch post.";
            })
            .addCase(fetchPost.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(fetchPost.fulfilled, (state: any, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
    },
});

export default postsSlice.reducer;
