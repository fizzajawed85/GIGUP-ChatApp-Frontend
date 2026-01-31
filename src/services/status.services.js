import axios from "axios";

const STATUS_URL = "http://localhost:5000/api/status";

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
