import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/ai`;

const getAuthHeader = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return {
        headers: {
            Authorization: `Bearer ${auth?.token}`,
        },
    };
};

export const chatWithGiga = async (text, conversationId = null, file = null) => {
    const formData = new FormData();
    if (text) formData.append("text", text);
    if (conversationId) formData.append("conversationId", conversationId);
    if (file) formData.append("file", file);

    const response = await axios.post(
        `${API_URL}/chat`,
        formData,
        getAuthHeader()
    );
    return response.data;
};

export const getAIConversations = async () => {
    const response = await axios.get(`${API_URL}/conversations`, getAuthHeader());
    return response.data;
};

export const getAIMessages = async (conversationId) => {
    const response = await axios.get(`${API_URL}/messages/${conversationId}`, getAuthHeader());
    return response.data;
};

export const deleteAIConversation = async (conversationId) => {
    const response = await axios.delete(`${API_URL}/conversation/${conversationId}`, getAuthHeader());
    return response.data;
};

export const renameAIConversation = async (conversationId, title) => {
    const response = await axios.put(`${API_URL}/conversation/${conversationId}`, { title }, getAuthHeader());
    return response.data;
};
