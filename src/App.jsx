import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// ... imports
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Chat from "./pages/chat/Chat";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import ChatNavbar from "./components/ChatNavbar";
import MainLayout from "./components/MainLayout";

// New Page Imports
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
import UpdatesTab from "./pages/others/UpdatesTab";
import Groups from "./pages/others/Groups";
import Calls from "./pages/others/Calls";
import Contacts from "./pages/others/Contacts";
import AIChat from "./pages/others/AIChat";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Routes with Sidebar and Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        {/* Redirect old status route to new updates route */}
        <Route path="/status" element={<Navigate to="/updates" replace />} />
        <Route path="/updates" element={<UpdatesTab />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/ai-chat" element={<AIChat />} />
      </Route>

      <Route path="/chat-navbar" element={<ChatNavbar />} />
      </Routes>
    </>
  );
}

export default App;
