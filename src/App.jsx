import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Chat from "./pages/chat/Chat"; 
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import ChatNavbar from "./components/ChatNavbar"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/chat" element={<Chat />} /> 
      <Route path="/chat-navbar" element={<ChatNavbar />} />
    </Routes>
  );
}

export default App;
