import axios from "axios";

const CHAT_URL = "http://localhost:5000/api/chat";
const MESSAGE_URL = "http://localhost:5000/api/message";

const getAuthConfig = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return {
    headers: {
      Authorization: `Bearer ${auth?.token}`,
    },
  };
};

export const createChat = async (email) => {
  const res = await axios.post(`${CHAT_URL}/create`, { email }, getAuthConfig());
  return res.data;
};

export const getChats = async () => {
  const res = await axios.get(CHAT_URL, getAuthConfig());
  return res.data;
};

export const getMessages = async (chatId) => {
  const res = await axios.get(`${MESSAGE_URL}/${chatId}`, getAuthConfig());
  return res.data;
};

export const sendMessage = async (chatId, text) => {
  const res = await axios.post(MESSAGE_URL, { chatId, text }, getAuthConfig());
  return res.data;
};

export const clearChat = async (chatId) => {
  const res = await axios.delete(`${MESSAGE_URL}/${chatId}/clear`, getAuthConfig());
  return res.data;
};
