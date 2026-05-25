import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ---------------------------------------------------
   Types
----------------------------------------------------*/

// Author Stats
export interface AuthorStats {
    id: number;
    total_views: number;
    total_posts: number;
    average_views_per_post: number;
    last_updated: string;
    author: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        bio: string[];
        profile_picture: string;
        is_author: boolean;
        created_at: string;
        updated_at: string;
    };
    monthly_stats?: {
        period_start: string;
        period_end: string;
        rate_per_post: number;
        monthly_total_posts: number;
        monthly_total_views: number;
        monthly_amount_due: number;
    };
}

// Single Post (used inside pagination results)
export interface AuthorPost {
    id: number;
    title: string;
    category: string;
    slug: string;
    publication_date: string;
    stats: {
        total_views: number;
        unique_views: number;
        average_time_spent: number;
        last_viewed: string;
    } | null;
}

// Paginated Posts Response
export interface AuthorPostsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: AuthorPost[];
}

export interface SuperAuthorWriter {
    author_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_author: boolean;
    total_posts: number;
    total_views: number;
    average_views_per_post: number;
    monthly_total_posts: number;
    monthly_total_views: number;
    amount_due: number;
    period_start: string;
    period_end: string;
}

export interface SuperAuthorCandidate {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_author: boolean;
    posts_count: number;
}

export interface SuperAuthorOverview {
    totals: {
        writers: number;
        posts: number;
        views: number;
        monthly_posts: number;
        monthly_views: number;
        amount_due: number;
        period_start: string;
        period_end: string;
        rate_per_post: number;
    };
    writers: SuperAuthorWriter[];
    candidates: SuperAuthorCandidate[];
}

export interface SuperAuthorPost {
    id: number;
    title: string;
    slug: string;
    category: string;
    publication_date: string;
    total_views: number;
    monthly_views: number;
}

export interface SuperAuthorPostsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    author: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    period_start: string;
    period_end: string;
    rate_per_post: number;
    results: SuperAuthorPost[];
}

// State
interface AuthorState {
    stats: AuthorStats | null;
    posts: AuthorPostsResponse | null;
    superOverview: SuperAuthorOverview | null;
    superPosts: SuperAuthorPostsResponse | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    superStatus: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    superError: string | null;
}

const initialState: AuthorState = {
    stats: null,
    posts: null,
    superOverview: null,
    superPosts: null,
    status: "idle",
    superStatus: "idle",
    error: null,
    superError: null,
};

/* --------------------------------------------------------
   Fetch Author Stats
--------------------------------------------------------- */
export const fetchAuthorMe = createAsyncThunk(
    "author/fetchAuthorMe",
    async (token: string) => {
        const headers = {
            Authorization: "Bearer " + token,
        };
        const response = await api.get("v1/admin/author/stats/author/me/", {
            headers,
        });
        return response.data as AuthorStats;
    }
);

/* --------------------------------------------------------
   FETCH AUTHOR POSTS WITH PAGINATION
--------------------------------------------------------- */
export const fetchAuthorPosts = createAsyncThunk(
    "author/fetchAuthorPosts",
    async (
        {
            token,
            page = 1,
        }: { token: string; page?: number }
    ) => {
        const headers = {
            Authorization: "Bearer " + token,
        };

        const response = await api.get(
            `v1/admin/author/stats/author/posts/?page=${page}`,
            { headers }
        );

        return response.data as AuthorPostsResponse;
    }
);

export const fetchSuperAuthorOverview = createAsyncThunk(
    "author/fetchSuperAuthorOverview",
    async (token: string) => {
        const response = await api.get("v1/admin/author/super/overview/", {
            headers: { Authorization: "Bearer " + token },
        });
        return response.data as SuperAuthorOverview;
    }
);

export const fetchSuperAuthorPosts = createAsyncThunk(
    "author/fetchSuperAuthorPosts",
    async ({ token, authorId, page = 1 }: { token: string; authorId: number; page?: number }) => {
        const response = await api.get(
            `v1/admin/author/super/writers/${authorId}/posts/?page=${page}`,
            { headers: { Authorization: "Bearer " + token } }
        );
        return response.data as SuperAuthorPostsResponse;
    }
);

export const updateWriterPermission = createAsyncThunk(
    "author/updateWriterPermission",
    async ({ token, userId, isAuthor }: { token: string; userId: number; isAuthor: boolean }) => {
        const response = await api.patch(
            `v1/admin/author/super/writers/${userId}/permission/`,
            { is_author: isAuthor },
            { headers: { Authorization: "Bearer " + token } }
        );
        return response.data as { id: number; username: string; email: string; is_author: boolean };
    }
);

/* --------------------------------------------------------
   SLICE
--------------------------------------------------------- */
const authorSlice = createSlice({
    name: "author",
    initialState,
    reducers: {
        clearAuthorData: (state) => {
            state.stats = null;
            state.posts = null;
            state.superOverview = null;
            state.superPosts = null;
            state.status = "idle";
            state.superStatus = "idle";
            state.error = null;
            state.superError = null;
        },
    },
    extraReducers: (builder) => {
        /* -------- Fetch Author Stats -------- */
        builder
            .addCase(fetchAuthorMe.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAuthorMe.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.stats = action.payload;
            })
            .addCase(fetchAuthorMe.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to fetch author stats.";
            });

        /* -------- Fetch Author Posts (Pagination) -------- */
        builder
            .addCase(fetchAuthorPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAuthorPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
            .addCase(fetchAuthorPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to fetch author posts.";
            });

        builder
            .addCase(fetchSuperAuthorOverview.pending, (state) => {
                state.superStatus = "loading";
            })
            .addCase(fetchSuperAuthorOverview.fulfilled, (state, action) => {
                state.superStatus = "succeeded";
                state.superOverview = action.payload;
            })
            .addCase(fetchSuperAuthorOverview.rejected, (state, action) => {
                state.superStatus = "failed";
                state.superError = action.error.message || "Failed to fetch master author overview.";
            })
            .addCase(fetchSuperAuthorPosts.pending, (state) => {
                state.superStatus = "loading";
                state.superPosts = null;
            })
            .addCase(fetchSuperAuthorPosts.fulfilled, (state, action) => {
                state.superStatus = "succeeded";
                state.superPosts = action.payload;
            })
            .addCase(fetchSuperAuthorPosts.rejected, (state, action) => {
                state.superStatus = "failed";
                state.superError = action.error.message || "Failed to fetch writer posts.";
            })
            .addCase(updateWriterPermission.fulfilled, (state, action) => {
                if (!state.superOverview) return;
                state.superOverview.candidates = state.superOverview.candidates.map((candidate) =>
                    candidate.id === action.payload.id
                        ? { ...candidate, is_author: action.payload.is_author }
                        : candidate
                );
            });
    },
});

export const { clearAuthorData } = authorSlice.actions;
export default authorSlice.reducer;
