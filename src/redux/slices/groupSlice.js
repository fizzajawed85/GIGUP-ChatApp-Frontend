import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGroups as getGroupsAPI } from "../../services/group.services";

// Fetch all groups for current user
export const fetchGroups = createAsyncThunk("group/fetchGroups", async () => {
    const data = await getGroupsAPI();
    return data;
});

const groupSlice = createSlice({
    name: "group",
    initialState: {
        groups: [],
        selectedGroup: null,
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        },
        addGroup: (state, action) => {
            state.groups.unshift(action.payload);
        },
        removeGroup: (state, action) => {
            state.groups = state.groups.filter(g => g._id !== action.payload);
            if (state.selectedGroup?._id === action.payload) {
                state.selectedGroup = null;
            }
        },
        updateGroupInList: (state, action) => {
            const index = state.groups.findIndex(g => g._id === action.payload._id);
            if (index !== -1) {
                state.groups[index] = action.payload;
            }
        },
        resetGroupUnreadCount: (state, action) => {
            const { groupId, userId } = action.payload;
            const group = state.groups.find(g => g._id === groupId);
            if (group) {
                const userCount = group.unreadCounts.find(uc => uc.user === userId);
                if (userCount) {
                    userCount.count = 0;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setSelectedGroup, addGroup, removeGroup, updateGroupInList, resetGroupUnreadCount } = groupSlice.actions;
export default groupSlice.reducer;
