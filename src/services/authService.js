import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/auth`;

// REGISTER
export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

// LOGIN
export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);

  // ✅ SAVE AUTH DATA CORRECTLY
  localStorage.setItem(
    "auth",
    JSON.stringify({
      user: response.data.user,
      token: response.data.token,
    })
  );

  return response.data;
};

// SOCIAL LOGIN
export const socialLogin = async (provider) => {
  let socialData;

  if (provider === "google") {
    socialData = { provider: "google", socialId: "GOOGLE_ID_123", username: "GoogleUser", email: "googleuser@gmail.com" };
  } else if (provider === "facebook") {
    socialData = { provider: "facebook", socialId: "FB_ID_123", username: "FBUser", email: "fbuser@gmail.com" };
  } else if (provider === "skype") {
    socialData = { provider: "skype", socialId: "SKYPE_ID_123", username: "SkypeUser", email: "skypeuser@gmail.com" };
  } else if (provider === "phone") {
    socialData = { provider: "phone", socialId: "PHONE_ID_123", username: "PhoneUser", email: "phoneuser@gmail.com" };
  }

  const response = await axios.post(`${API_URL}/social-login`, socialData);

  // ✅ SAVE AUTH DATA CORRECTLY
  localStorage.setItem(
    "auth",
    JSON.stringify({
      user: response.data.user,
      token: response.data.token,
    })
  );

  return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
  const response = await axios.post(
    `${API_URL}/forgot-password`,
    data
  );
  return response.data;
};

// verify otp 
export const verifyOtp = async (data) => {
  const res = await axios.post(`${API_URL}/verify-otp`, data);
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async (token, data) => {
  const response = await axios.post(
    `${API_URL}/reset-password/${token}`,
    data
  );
  return response.data;
};
