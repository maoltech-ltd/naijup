"use client";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import { PersistConfig } from 'redux-persist'
import rootReducer from "./reducers";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

interface NoopStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}


const createNoopStorage = (): NoopStorage => {
    return {
        getItem(_key) {
            return Promise.resolve(null);
        },
        setItem(_key, _value) {
            return Promise.resolve();
        },
        removeItem(_key) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage('local') : createNoopStorage();

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
    key: 'root',
    storage,
    timeout: 5000
  };
  
const persistedReducer = persistReducer(persistConfig, rootReducer);
  
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;