import axios from "axios";

// Helper to get token
const getAuthHeaders = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.token;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const API_URL = "http://localhost:5000/api/user";

export const getProfile = async () => {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axios.put(`${API_URL}/profile`, data, getAuthHeaders());
    return response.data;
};

export const uploadAvatar = async (formData) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.token;

    const response = await axios.post(`${API_URL}/avatar`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const uploadCover = async (formData) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.token;

    const response = await axios.post(`${API_URL}/cover`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
