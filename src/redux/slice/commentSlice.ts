import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Comment {
    id: string;
    postId: string;
    author: string;
    content: string;
    createdAt: string;
}

interface CommentState {
    comments: Comment[];
    status: string;
    error: string | null;
}

const initialState: CommentState = {
    comments: [],
    status: "idle",
    error: null,
};

// Thunk to fetch comments for a post
export const fetchComments = createAsyncThunk('comments/fetchComments', async (postId: string) => {
    const response = await axios.get(`/api/posts/${postId}/comments`);
    return response.data;
});

// Thunk to add a new comment
export const addComment = createAsyncThunk('comments/addComment', async (newComment: { postId: string; author: string; content: string }) => {
    const response = await axios.post(`/api/posts/${newComment.postId}/comments`, newComment);
    return response.data;
});

// Thunk to delete a comment
export const deleteComment = createAsyncThunk('comments/deleteComment', async (commentId: string) => {
    await axios.delete(`/api/comments/${commentId}`);
    return commentId;
});

const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments = action.payload;
            })
            .addCase(fetchComments.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch comments.";
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments.push(action.payload);
            })
            .addCase(addComment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add comment.";
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments = state.comments.filter(comment => comment.id !== action.payload);
            })
            .addCase(deleteComment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to delete comment.";
            });
    },
});

export default commentSlice.reducer;
