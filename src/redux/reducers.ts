import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { categoryReducer, commentReducer, imageReducer, postReducer, userReducer } from "./slice";


const rootReducer = combineReducers({
    user: userReducer,
    post: postReducer,
    comment: commentReducer,
    category: categoryReducer,
    image: imageReducer
})


export default rootReducer