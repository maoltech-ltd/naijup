import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { categoryReducer, commentReducer, imageReducer, postReducer, secondUserReducer, userReducer } from "./slice";


const rootReducer = combineReducers({
    user: userReducer,
    post: postReducer,
    comment: commentReducer,
    category: categoryReducer,
    image: imageReducer,
    secondUser: secondUserReducer
})


export default rootReducer