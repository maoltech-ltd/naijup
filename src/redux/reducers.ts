import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { 
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
    headlinesReducer,
    authorReducer,
} from "./slice";


const rootReducer = combineReducers({
    user: userReducer,
    posts: postsReducer,
    image: imageReducer,
    secondUser: secondUserReducer,
    post: postReducer,
    fx: fxReducer,
    equity: equityReducer,
    snapshot: snapshotReducer,
    bond: bondReducer,
    etf: etfReducer,
    headlines: headlinesReducer,
    author: authorReducer,
})

export default rootReducer
