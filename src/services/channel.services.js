import axios from "axios";

const CHANNEL_URL = "http://localhost:5000/api/channel";

const getAuthConfig = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return {
        headers: {
            Authorization: `Bearer ${auth?.token}`,
        },
    };
};

export const createChannel = async (channelData) => {
    const res = await axios.post(CHANNEL_URL, channelData, getAuthConfig());
    return res.data;
};

export const getChannels = async () => {
    const res = await axios.get(CHANNEL_URL, getAuthConfig());
    return res.data;
};

export const joinChannel = async (channelId) => {
    const res = await axios.post(`${CHANNEL_URL}/${channelId}/join`, {}, getAuthConfig());
    return res.data;
};

export const postChannelUpdate = async (channelId, updateData) => {
    const res = await axios.post(`${CHANNEL_URL}/${channelId}/update`, updateData, getAuthConfig());
    return res.data;
};

export const getChannelUpdates = async (channelId) => {
    const res = await axios.get(`${CHANNEL_URL}/${channelId}/updates`, getAuthConfig());
    return res.data;
};
