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

export const { setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
