// src/pages/chat/Chat.jsx
import React from "react";
import ChatNavbar from "../../components/ChatNavbar";
import ChatSidebar from "../../components/ChatSidebar";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";

const Chat = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111727] flex flex-col">
      
      {/* Navbar */}
      <ChatNavbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
      
        {/* Left Sidebar */}
        <ChatSidebar />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden ">

          {/*Chat List*/}
           <ChatList /> 

          {/* Chat Window */}
          <ChatWindow />

        </div>
      </div>
   </div>
  );
};

export default Chat;


