import axios from "axios";
import { API_BASE_URL } from "../config";

const CALL_URL = `${API_BASE_URL}/call`;

const getAuthConfig = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return {
        headers: {
            Authorization: `Bearer ${auth?.token}`,
        },
    };
};

export const getCallHistory = async () => {
    const res = await axios.get(`${CALL_URL}/history`, getAuthConfig());
    return res.data;
};

export const createCallLog = async (data) => {
    const res = await axios.post(`${CALL_URL}/log`, data, getAuthConfig());
    return res.data;
};
