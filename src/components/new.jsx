import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, addMessage } from "../redux/slices/messageSlice";
import { socket } from "../utils/socket";
import { sendMessage } from "../services/chat.services";
import MessageItem from "./MessageItem";

import {
  FiSearch,
  FiMoreVertical,
  FiSend
} from "react-icons/fi";
import { MdCall, MdVideocam, MdMic } from "react-icons/md";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const [text, setText] = useState("");

  const { selectedChat } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.message);

  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id;

  /* SOCKET */
  useEffect(() => {
    if (!userId) return;

    socket.auth = { userId };
    socket.connect();

    socket.on("receiveMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [dispatch, userId]);

  /* FETCH */
  useEffect(() => {
    if (!selectedChat) return;
    socket.emit("joinChat", selectedChat._id);
    dispatch(fetchMessages(selectedChat._id));
  }, [selectedChat, dispatch]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SEND */
  const handleSend = async () => {
    if (!text.trim()) return;

    const payload = {
      chatId: selectedChat._id,
      senderId: userId,
      text,
      createdAt: new Date(),
      sender: { _id: userId },
      status: "sent",
    };

    dispatch(addMessage({ ...payload, _id: Date.now() }));

    if (socket.connected) {
      socket.emit("sendMessage", payload);
    } else {
      await sendMessage(selectedChat._id, text);
    }

    setText("");
  };

  if (!selectedChat) {
    return (
      <div
        className="flex items-center justify-center text-gray-400"
        style={{ height: "calc(100vh - 64px)" }}
      >
        Select a chat
      </div>
    );
  }

  return (
    /* 👇 EXACT SAME HEIGHT AS SIDEBAR */
    <div
      className="flex flex-col flex-1 min-w-0 bg-white dark:bg-[#0b141a]"
      style={{ height: "calc(100vh - 50px)" }}
    >
      {/* ================= HEADER ================= */}
      <div className="h-16 px-4 flex items-center justify-between border-b dark:border-zinc-700 bg-white dark:bg-[#202c33] shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={selectedChat.avatar || "/avatar.png"}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">
              {selectedChat.name}
            </p>
            <p className="text-xs text-green-500">
              {selectedChat.isOnline ? "Active" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xl text-gray-600 dark:text-gray-300">
          <FiSearch />
          <MdCall />
          <MdVideocam />
          <FiMoreVertical />
        </div>
      </div>

      {/* ================= MESSAGES (ONLY THIS SCROLLS) ================= */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-[url('/chat-bg.png')] dark:bg-[#0b141a]">
        {messages.map((msg) => (
          <MessageItem
            key={msg._id}
            message={msg}
            isOwnMessage={msg.sender?._id === userId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div className="h-16 px-4 flex items-center gap-3 border-t dark:border-zinc-700 bg-white dark:bg-[#202c33] shrink-0">
        <BsThreeDots className="text-xl" />
        <BsEmojiSmile className="text-xl" />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-[#111b21] outline-none text-sm"
        />

        <MdMic className="text-2xl" />

        <button
          onClick={handleSend}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
