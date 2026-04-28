"use client";

import React from "react"
import { persistStore } from "redux-persist";
import store from "./store";
import { Provider } from "react-redux";

persistStore(store);

const ReduxProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <Provider store={store}>{children}</Provider>
  )
}

export default ReduxProvider
