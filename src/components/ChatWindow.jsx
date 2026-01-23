import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, addMessage } from "../redux/slices/messageSlice";
import { socket } from "../utils/socket";
import { sendMessage } from "../services/chat.services";
import MessageItem from "./MessageItem";
import useTheme from "../hooks/useTheme";

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

  const { theme } = useTheme();
  const { selectedChat } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.message);

  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id;

  const otherUser =
    selectedChat?.participants?.find((p) => p._id !== userId) || null;

  const formatLastSeen = (dateStr) => {
    if (!dateStr) return "Offline";
    const d = new Date(dateStr);
    return `Last seen ${d.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    })}`;
  };

  /* SOCKET */
  useEffect(() => {
    if (!userId) return;

    socket.auth = { userId };
    socket.connect();

    socket.off("receiveMessage");
    socket.on("receiveMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [dispatch, userId]);

  /* FETCH */
  useEffect(() => {
    if (!selectedChat) return;

    socket.emit("joinChat", selectedChat._id);
    dispatch(fetchMessages(selectedChat._id));

    return () => {
      socket.emit("leaveChat", selectedChat._id);
    };
  }, [selectedChat, dispatch]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SEND */
  const handleSend = async () => {
    if (!text.trim()) return;

    const payload = {
      chat: selectedChat._id,
      sender: userId,
      text,
    };

    dispatch(addMessage({
      ...payload,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "sent",
    }));

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
        className={`flex items-center justify-center text-gray-500
          ${theme === "dark" ? "bg-[#111827]" : "bg-white"}`}
        style={{ height: "calc(100vh - 50px)", width: "80%" }}
      >
        <div className="text-center flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">
            Pick a chat to start
          </p>
          <p className="text-sm text-gray-400">
            Your messages will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col flex-1 min-w-0"
      style={{ height: "calc(100vh - 50px)" }}
    >
      {/* HEADER */}
      <div className="h-16 px-4 flex items-center justify-between border-b
        dark:border-zinc-700 bg-white dark:bg-[#202c33] shrink-0"
      >
        <div className="flex items-center gap-3">
          <img
            src={otherUser?.avatar || "/avatar.png"}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {otherUser?.username || "Unknown"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {otherUser?.isOnline ? "Active" : formatLastSeen(otherUser?.lastSeen)}
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

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2
  bg-[url('/chat-bg.png')] dark:bg-[#0b141a]"
>
        {messages.map((msg) => (
          <MessageItem
            key={msg._id}
            message={msg}
            isOwnMessage={msg.sender === userId || msg.sender?._id === userId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="h-16 px-4 flex items-center gap-3 border-t
        dark:border-zinc-700 bg-white dark:bg-[#202c33] shrink-0"
      >
        <BsThreeDots className="text-xl" />
        <BsEmojiSmile className="text-xl" />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-[#111b21]
            outline-none text-sm text-gray-900 dark:text-white"
        />

        <MdMic className="text-2xl" />

        <button
          onClick={handleSend}
          className="w-10 h-10 flex items-center justify-center rounded-full
            bg-sky-400 dark:bg-sky-500 text-white"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
