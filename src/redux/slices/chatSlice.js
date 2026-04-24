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
    resetChatUnreadCount: (state, action) => {
      const { chatId, userId } = action.payload;
      const targetUserId = userId?.toString()?.toLowerCase();
      const index = state.chats.findIndex(c => c._id === chatId);

      if (index !== -1) {
        const chat = state.chats[index];
        if (chat.unreadCounts) {
          chat.unreadCounts.forEach(uc => {
            const uId = (uc.user?._id || uc.user)?.toString()?.toLowerCase();
            if (uId === targetUserId) {
              uc.count = 0;
            }
          });
        }
      }

      if (state.selectedChat?._id === chatId && state.selectedChat.unreadCounts) {
        state.selectedChat.unreadCounts.forEach(uc => {
          const uId = (uc.user?._id || uc.user)?.toString()?.toLowerCase();
          if (uId === targetUserId) {
            uc.count = 0;
          }
        });
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

export const { setSelectedChat, updateChatLatestMessage, updateChat, resetChatUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
