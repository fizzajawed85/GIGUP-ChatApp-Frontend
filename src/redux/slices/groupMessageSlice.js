import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGroupMessages as getGroupMessagesAPI } from "../../services/group.services";

// Fetch messages for a group
export const fetchGroupMessages = createAsyncThunk(
    "groupMessage/fetchGroupMessages",
    async (groupId) => {
        const data = await getGroupMessagesAPI(groupId);
        return data;
    }
);

const groupMessageSlice = createSlice({
    name: "groupMessage",
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        addGroupMessage: (state, action) => {
            const exists = state.messages.some(m => m._id === action.payload._id || m.tempId === action.payload.tempId);
            if (!exists) {
                state.messages.push(action.payload);
            } else if (action.payload._id) {
                // If it exists but was optimistic (tempId), update it with real server data
                const index = state.messages.findIndex(m => m.tempId === action.payload.tempId);
                if (index !== -1) {
                    state.messages[index] = action.payload;
                }
            }
        },
        updateGroupMessage: (state, action) => {
            const index = state.messages.findIndex(m => m._id === action.payload._id);
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
        },
        clearGroupMessages: (state) => {
            state.messages = [];
        },
        markGroupMessageAsRead: (state, action) => {
            const { messageId, userId } = action.payload;
            const message = state.messages.find(m => m._id === messageId);
            if (message) {
                if (!message.readBy.includes(userId)) {
                    message.readBy.push(userId);
                }
            }
        },
        markAllGroupMessagesAsRead: (state, action) => {
            const { userId } = action.payload;
            state.messages.forEach(msg => {
                if (!msg.readBy.includes(userId)) {
                    msg.readBy.push(userId);
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroupMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGroupMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchGroupMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { addGroupMessage, updateGroupMessage, clearGroupMessages, markGroupMessageAsRead, markAllGroupMessagesAsRead } = groupMessageSlice.actions;
export default groupMessageSlice.reducer;
