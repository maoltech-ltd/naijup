// import api from "@/src/api";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// interface Comment {
//     id: string;
//     postId: string;
//     author: string;
//     content: string;
//     createdAt: string;
// }

// interface CommentState {
//     comments: Comment[];
//     status: string;
//     error: string | null;
// }

// const initialState: CommentState = {
//     comments: [],
//     status: "idle",
//     error: null,
// };

// // Thunk to fetch comments for a post
// export const fetchComments = createAsyncThunk('comments/fetchComments', async (postId: string) => {
//     const response = await api.get(`/api/posts/${postId}/comments`);
//     return response.data;
// });

// // Thunk to add a new comment
// export const addComment = createAsyncThunk('comments/addComment', async (newComment: { postId: string; author: string; content: string }) => {
//     const response = await api.post(`/api/posts/${newComment.postId}/comments`, newComment);
//     return response.data;
// });

// // Thunk to delete a comment
// export const deleteComment = createAsyncThunk('comments/deleteComment', async (commentId: string) => {
//     await api.delete(`/api/comments/${commentId}`);
//     return commentId;
// });

// const commentSlice = createSlice({
//     name: "comments",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchComments.fulfilled, (state, action) => {
//                 state.status = "succeeded";
//                 state.comments = action.payload;
//             })
//             .addCase(fetchComments.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(fetchComments.rejected, (state, action) => {
//                 state.status = "failed";
//                 state.error = action.error.message || "Failed to fetch comments.";
//             })
//             .addCase(addComment.fulfilled, (state, action) => {
//                 state.status = "succeeded";
//                 state.comments.push(action.payload);
//             })
//             .addCase(addComment.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(addComment.rejected, (state, action) => {
//                 state.status = "failed";
//                 state.error = action.error.message || "Failed to add comment.";
//             })
//             .addCase(deleteComment.fulfilled, (state, action) => {
//                 state.status = "succeeded";
//                 state.comments = state.comments.filter(comment => comment.id !== action.payload);
//             })
//             .addCase(deleteComment.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(deleteComment.rejected, (state, action) => {
//                 state.status = "failed";
//                 state.error = action.error.message || "Failed to delete comment.";
//             });
//     },
// });

// export default commentSlice.reducer;
import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Comment {
    id: number;
    post: number;        // backend returns post_id as "post"
    author: string;      // assuming backend returns author username
    content: string;
    created_at: string;  // matches serializer
}

interface CommentState {
    comments: Comment[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CommentState = {
    comments: [],
    status: "idle",
    error: null,
};

// Fetch comments for a post
export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (postId: number) => {
        const response = await api.get(`v1/blog/${postId}/comments/`);
        return response.data as Comment[];
    }
);

// Add a new comment
export const addComment = createAsyncThunk(
    "comments/addComment",
    async ({ postId, content }: { postId: number; content: string }) => {
        const response = await api.post(`v1/blog/${postId}/comments/`, { content });
        return response.data as Comment;
    }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async ({ postId, commentId }: { postId: number; commentId: number }) => {
        await api.delete(`v1/blog/${postId}/comments/${commentId}/`);
        return commentId;
    }
);

const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchComments.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch comments.";
            })
            // ADD
            .addCase(addComment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments.unshift(action.payload); // newest first
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add comment.";
            })
            // DELETE
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments = state.comments.filter(
                    (c) => c.id !== action.payload
                );
            });
    },
});

export default commentSlice.reducer;
