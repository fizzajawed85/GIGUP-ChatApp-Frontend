import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as aiService from "../../services/ai.services";

export const fetchAIConversations = createAsyncThunk(
    "ai/fetchConversations",
    async () => {
        return await aiService.getAIConversations();
    }
);

export const fetchAIMessages = createAsyncThunk(
    "ai/fetchMessages",
    async (id) => {
        return await aiService.getAIMessages(id);
    }
);

export const sendAIMessage = createAsyncThunk(
    "ai/sendMessage",
    async ({ text, conversationId, file }) => {
        return await aiService.chatWithGiga(text, conversationId, file);
    }
);

export const renameAIConversation = createAsyncThunk(
    "ai/renameConversation",
    async ({ conversationId, title }) => {
        return await aiService.renameAIConversation(conversationId, title);
    }
);

const aiSlice = createSlice({
    name: "ai",
    initialState: {
        conversations: [],
        messages: [],
        selectedConversation: null,
        loading: false,
        sending: false,
        error: null,
        newChatActive: false,
    },
    reducers: {
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload;
            if (action.payload) state.newChatActive = false;
        },
        clearAIMessages: (state) => {
            state.messages = [];
        },
        setNewChatActive: (state, action) => {
            state.newChatActive = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Conversations
            .addCase(fetchAIConversations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAIConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchAIConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch Messages
            .addCase(fetchAIMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
            })
            // Send Message
            .addCase(sendAIMessage.pending, (state) => {
                state.sending = true;
            })
            .addCase(sendAIMessage.fulfilled, (state, action) => {
                state.sending = false;
                if (!state.selectedConversation) {
                    state.selectedConversation = action.payload.conversation;
                    state.conversations.unshift(action.payload.conversation);
                }
                state.messages.push(action.payload.userMessage);
                state.messages.push(action.payload.aiMessage);

                // Update conversation's last message in list
                const idx = state.conversations.findIndex(c => c._id === action.payload.conversation._id);
                if (idx !== -1) {
                    state.conversations[idx] = action.payload.conversation;
                }
            })
            .addCase(sendAIMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.error.message;
            })
            // Rename Conversation
            .addCase(renameAIConversation.fulfilled, (state, action) => {
                const idx = state.conversations.findIndex(c => c._id === action.payload._id);
                if (idx !== -1) {
                    state.conversations[idx].title = action.payload.title;
                }
                if (state.selectedConversation?._id === action.payload._id) {
                    state.selectedConversation.title = action.payload.title;
                }
            });
    },
});

export const { setSelectedConversation, clearAIMessages, setNewChatActive } = aiSlice.actions;
export default aiSlice.reducer;
