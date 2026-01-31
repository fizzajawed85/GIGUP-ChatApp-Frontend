import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChats } from "../../services/chat.services";

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, thunkAPI) => {
    try {
      return await getChats();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
    loading: false,
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    updateChatLatestMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const index = state.chats.findIndex(c => c._id === chatId);
      if (index !== -1) {
        // Update the chat with new latest message
        state.chats[index].latestMessage = message;
        state.chats[index].updatedAt = message.createdAt;

        // Move to top
        const updatedChat = state.chats.splice(index, 1)[0];
        state.chats.unshift(updatedChat);

        // Also update selectedChat if it's the current one
        if (state.selectedChat?._id === chatId) {
          state.selectedChat.latestMessage = message;
        }
      }
    },
    updateChat: (state, action) => {
      const updatedChat = action.payload;
      const index = state.chats.findIndex(c => c._id === updatedChat._id);
      if (index !== -1) {
        state.chats[index] = updatedChat;
        const chat = state.chats.splice(index, 1)[0];
        state.chats.unshift(chat);
      } else {
        state.chats.unshift(updatedChat);
      }
      if (state.selectedChat?._id === updatedChat._id) {
        state.selectedChat = updatedChat;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedChat, updateChatLatestMessage, updateChat } = chatSlice.actions;
export default chatSlice.reducer;
