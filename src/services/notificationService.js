import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const getAuthConfig = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return {
        headers: {
            Authorization: `Bearer ${auth?.token}`,
        },
    };
};

export const getNotifications = async () => {
    const res = await axios.get(API_URL, getAuthConfig());
    return res.data;
};

export const markAllRead = async () => {
    const res = await axios.put(`${API_URL}/read-all`, {}, getAuthConfig());
    return res.data;
};

export const clearNotifications = async () => {
    const res = await axios.delete(`${API_URL}/clear`, getAuthConfig());
    return res.data;
};
