import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { categoryReducer, commentReducer, imageReducer, postsReducer, secondUserReducer, userReducer, postReducer } from "./slice";


const rootReducer = combineReducers({
    user: userReducer,
    posts: postsReducer,
    comment: commentReducer,
    category: categoryReducer,
    image: imageReducer,
    secondUser: secondUserReducer,
    post: postReducer
})

export default rootReducer