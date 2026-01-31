// src/pages/chat/Chat.jsx
import React from "react";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";

const Chat = () => {
  return (
    <div className="flex flex-1 overflow-hidden w-full">
      {/*Chat List*/}
      <ChatList />

      {/* Chat Window */}
      <ChatWindow />
    </div>
  );
};

export default Chat;



