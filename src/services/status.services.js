import axios from "axios";
import { API_BASE_URL } from "../config";

const STATUS_URL = `${API_BASE_URL}/status`;

const getAuthConfig = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return {
        headers: {
            Authorization: `Bearer ${auth?.token}`,
        },
    };
};

export const createStatus = async (statusData) => {
    const res = await axios.post(STATUS_URL, statusData, getAuthConfig());
    return res.data;
};

export const getStatusFeed = async () => {
    const res = await axios.get(STATUS_URL, getAuthConfig());
    return res.data;
};

export const markStatusViewed = async (statusId) => {
    const res = await axios.post(`${STATUS_URL}/${statusId}/view`, {}, getAuthConfig());
    return res.data;
};
