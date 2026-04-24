import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/group`;

const getAuthHeader = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return { Authorization: `Bearer ${auth?.token}` };
};

// Create new group
export const createGroup = async (formData) => {
    const response = await axios.post(API_URL, formData, {
        headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// Get all groups for current user
export const getGroups = async () => {
    const response = await axios.get(API_URL, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Get specific group details
export const getGroupDetails = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Update group
export const updateGroup = async (id, formData) => {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// Leave group
export const leaveGroup = async (id) => {
    const response = await axios.post(`${API_URL}/${id}/leave`, {}, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Add members to group
export const addMembers = async (id, memberIds) => {
    const response = await axios.post(
        `${API_URL}/${id}/add-members`,
        { memberIds },
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Remove member from group
export const removeMember = async (id, memberId) => {
    const response = await axios.post(
        `${API_URL}/${id}/remove-member`,
        { memberId },
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Send group message
// Send group message
export const sendGroupMessage = async (groupId, content) => {
    // Content can be plain text string OR FormData
    const isFormData = content instanceof FormData;

    const response = await axios.post(
        `${API_URL}/${groupId}/message`,
        isFormData ? content : { text: content },
        {
            headers: {
                ...getAuthHeader(),
                ...(isFormData ? { "Content-Type": "multipart/form-data" } : {})
            }
        }
    );
    return response.data;
};

// Get group messages
export const getGroupMessages = async (groupId) => {
    const response = await axios.get(`${API_URL}/${groupId}/messages`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Mark message as read
export const markMessageAsRead = async (groupId, msgId) => {
    const response = await axios.put(
        `${API_URL}/${groupId}/message/${msgId}/read`,
        {},
        { headers: getAuthHeader() }
    );
    return response.data;
};
