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

export const createChat = async (email, nickname) => {
  const res = await axios.post(`${CHAT_URL}/create`, { email, nickname }, getAuthConfig());
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

export const sendMessage = async (chatId, content) => {
  const isFormData = content instanceof FormData;
  const res = await axios.post(
    MESSAGE_URL,
    isFormData ? content : { chatId, text: content },
    {
      headers: {
        ...getAuthConfig().headers,
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {})
      }
    }
  );
  return res.data;
};

export const clearChat = async (chatId) => {
  const res = await axios.delete(`${MESSAGE_URL}/${chatId}/clear`, getAuthConfig());
  return res.data;
};

export const editMessage = async (messageId, text) => {
  const res = await axios.put(`${MESSAGE_URL}/${messageId}`, { text }, getAuthConfig());
  return res.data;
};

export const deleteMessage = async (messageId, deleteType = "forMe") => {
  const res = await axios.post(`${MESSAGE_URL}/${messageId}/delete`, { deleteType }, getAuthConfig());
  return res.data;
};
