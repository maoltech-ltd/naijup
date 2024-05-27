import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer, commentReducer, postReducer, userReducer } from "./slice";


const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
        comment: commentReducer,
        category: categoryReducer,
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;