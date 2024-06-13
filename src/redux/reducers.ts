import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { categoryReducer, commentReducer, postReducer, userReducer } from "./slice";


const rootReducer = combineReducers({
    user: userReducer,
    post: postReducer,
    comment: commentReducer,
    category: categoryReducer
})


export default rootReducer