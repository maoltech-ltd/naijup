import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { 
    categoryReducer, 
    commentReducer, 
    imageReducer, 
    postsReducer, 
    secondUserReducer, 
    userReducer, 
    postReducer, 
    fxReducer,
    snapshotReducer,
    equityReducer,
    bondReducer,
    etfReducer, 
} from "./slice";


const rootReducer = combineReducers({
    user: userReducer,
    posts: postsReducer,
    comment: commentReducer,
    category: categoryReducer,
    image: imageReducer,
    secondUser: secondUserReducer,
    post: postReducer,
    fx: fxReducer,
    equity: equityReducer,
    snapshot: snapshotReducer,
    bond: bondReducer,
    etf: etfReducer
})

export default rootReducer