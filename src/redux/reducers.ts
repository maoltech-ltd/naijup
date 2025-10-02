import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { categoryReducer, commentReducer, imageReducer, postsReducer, secondUserReducer, userReducer, postReducer, marketReducer } from "./slice";


const rootReducer = combineReducers({
    user: userReducer,
    posts: postsReducer,
    comment: commentReducer,
    category: categoryReducer,
    image: imageReducer,
    secondUser: secondUserReducer,
    post: postReducer,
    market: marketReducer
})

export default rootReducer