// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import messageReducer from "./slices/messageSlice";
import groupReducer from "./slices/groupSlice";
import groupMessageReducer from "./slices/groupMessageSlice";
import aiReducer from "./slices/aiSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    message: messageReducer,
    group: groupReducer,
    groupMessage: groupMessageReducer,
    ai: aiReducer,
  },
});

export default store;