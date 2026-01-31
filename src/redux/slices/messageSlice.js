import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMessages } from "../../services/chat.services";

export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async (chatId) => await getMessages(chatId)
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      //  duplicate protection
      if (!state.messages.find(m => m._id === action.payload._id)) {
        state.messages.push(action.payload);
      }
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(m => m._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(m => m._id !== action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export const { addMessage, updateMessage, removeMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
