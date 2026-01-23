// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import messageReducer from "./slices/messageSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    message: messageReducer,
  },
});

export default store;