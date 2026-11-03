import api from "@/src/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AnalysisMeta {
    rating?: "buy" | "hold" | "sell" | "accumulate" | "";
    target_price?: number | null;
    tickers?: string[];
}

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
    slug: string;
    post_type?: "article" | "analysis";
    analysis_meta?: AnalysisMeta;
    is_premium?: boolean;
    // True when the API sent only a preview (reader can't see the full post).
    is_locked?: boolean;
}

interface PostState {
    post:   Post | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
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

// Pass the token so authors and admins get the full text of premium posts.
export const fetchPostBySlug = createAsyncThunk('posts/fetchPostBySlug', async ({ slug, token }: { slug: string; token?: string }) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await api.get(`v1/blog/post/slug/${slug}/`, { headers });
    return response.data;
})

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPost: (state, action: PayloadAction<Post>) => {
          state.post = action.payload;
          state.status = "succeeded";
          state.error = null;
        },
        clearPost: (state) => {
            state.post = null;
            state.status = "idle";
            state.error = null;
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

        builder
            .addCase(fetchPostBySlug.pending, (state) => {
              state.status = "loading";
            })
            .addCase(fetchPostBySlug.fulfilled, (state, action: PayloadAction<Post>) => {
              state.status = "succeeded";
              state.post = action.payload;
            })
            .addCase(fetchPostBySlug.rejected, (state, action: any) => {
              state.status = "failed";
              state.error = action.payload || "Failed to fetch post by slug.";
            });
    },
});

export const { setPost, clearPost } = postSlice.actions;
export default postSlice.reducer;
