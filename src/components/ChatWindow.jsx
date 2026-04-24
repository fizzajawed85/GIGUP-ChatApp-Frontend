import { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, addMessage, updateMessage } from "../redux/slices/messageSlice";
import { socket } from "../utils/socket";
import { sendMessage, editMessage, markChatAsRead } from "../services/chat.services";
import { resetChatUnreadCount, setSelectedChat } from "../redux/slices/chatSlice";
import MessageItem from "./MessageItem";
import useTheme from "../hooks/useTheme";
import { CallingContext } from "../context/CallingContext";
import useVoiceRecorder from "../hooks/useVoiceRecorder";
import { BASE_URL } from "../config";

import {
  FiSearch,
  FiMoreVertical,
  FiSend,
  FiImage,
  FiArrowLeft
} from "react-icons/fi";
import { MdCall, MdVideocam, MdMic } from "react-icons/md";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { theme } = useTheme();
  const { callUser } = useContext(CallingContext);
  const {
    isRecording,
    isProcessing,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    formattedTime
  } = useVoiceRecorder();
  const { selectedChat } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.message);

  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const userId = auth?.user?._id?.toString()?.toLowerCase();

  useEffect(() => {
    if (selectedChat) {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const currentUserId = auth?.user?._id?.toString()?.toLowerCase();
      const found = selectedChat.participants?.find((p) => {
        const pId = (p._id || p).toString().toLowerCase();
        return pId !== currentUserId;
      }) || null;
      setOtherUser(found);
    }
  }, [selectedChat, userId]);

  const nicknameObj = selectedChat?.nicknames?.find(n => {
    const nUserId = n.user?._id ? n.user._id.toString() : n.user?.toString();
    return nUserId?.toLowerCase() === userId;
  });
  const displayName = nicknameObj?.name || otherUser?.username || "Unknown";

  const formatLastSeen = (dateStr) => {
    if (!dateStr) return "Offline";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (now - d) / 1000; // seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return d.toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* SOCKET */
  useEffect(() => {
    if (!userId) return;

    const handleReceive = (msg) => {
      const senderIdStr = (msg.sender?._id || msg.sender)?.toString()?.toLowerCase();
      const currentUserIdStr = userId?.toLowerCase();

      dispatch(addMessage(msg));

      // Emit delivered/seen if message is for this active chat and NOT from us
      const selectedChatIdStr = selectedChat?._id?.toString()?.toLowerCase();
      const msgChatIdStr = (msg.chat?._id || msg.chat)?.toString()?.toLowerCase();

      if (msgChatIdStr === selectedChatIdStr && senderIdStr && currentUserIdStr && senderIdStr !== currentUserIdStr) {
        socket.emit("messageDelivered", msg._id);
        socket.emit("messageSeen", { chatId: selectedChat._id, userId });
        dispatch(resetChatUnreadCount({ chatId: selectedChat._id, userId }));
        // API fallback
        markChatAsRead(selectedChat._id).catch(err => console.error("REST MarkAsRead Error:", err));
      }
    };

    socket.on("receiveMessage", handleReceive);

    socket.on("messageUpdated", (updatedMsg) => {
      dispatch(updateMessage(updatedMsg));
    });
    socket.on("messagesSeen", ({ chatId }) => {
      // No need to re-fetch all messages, just handle ticks via messageUpdated
    });

    socket.on("statusChange", ({ userId: changedUserId, isOnline, lastSeen }) => {
      setOtherUser(prev => {
        if (prev?._id === changedUserId) {
          return { ...prev, isOnline, lastSeen };
        }
        return prev;
      });
    });

    socket.on("userTyping", ({ userId: typingUserId }) => {
      if (typingUserId === otherUser?._id) {
        setIsTyping(true);
      }
    });

    socket.on("userStopTyping", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("messageUpdated");
      socket.off("statusChange");
      socket.off("messagesSeen");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [dispatch, userId, selectedChat?._id, otherUser?._id]);

  /* FETCH */
  useEffect(() => {
    if (!selectedChat?._id) return;

    socket.emit("joinChat", selectedChat._id);
    dispatch(fetchMessages(selectedChat._id));

    if (userId) {
      console.log(">>> ChatWindow: Opened chat, emitting messageSeen for:", selectedChat._id);
      socket.emit("messageSeen", { chatId: selectedChat._id, userId });
      dispatch(resetChatUnreadCount({ chatId: selectedChat._id, userId }));
      // API Fallback
      markChatAsRead(selectedChat._id).catch(err => console.error("REST MarkAsRead Error:", err));
    }

    return () => {
      console.log(">>> ChatWindow: Leaving chat:", selectedChat._id);
      socket.emit("leaveChat", selectedChat._id);
    };
  }, [selectedChat?._id, dispatch, userId]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* HANDLERS */
  const handleTextChange = (e) => {
    setText(e.target.value);

    if (selectedChat) {
      socket.emit("typing", { chatId: selectedChat._id, userId });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { chatId: selectedChat._id, userId });
      }, 2000);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!text.trim() && !selectedFile) || !selectedChat) return;

    try {
      if (editingMessage) {
        // Edit Mode (Text only for now)
        const updated = await editMessage(editingMessage._id, text);
        dispatch(updateMessage(updated));
        socket.emit("editMessage", updated);
        setEditingMessage(null);
      } else {
        // Normal Send (Text or File)
        if (selectedFile) {
          const formData = new FormData();
          formData.append("chatId", selectedChat._id);
          formData.append("text", text.trim());
          formData.append("file", selectedFile);

          const newMessage = await sendMessage(selectedChat._id, formData);
          dispatch(addMessage(newMessage));
          clearFile();
        } else {
          const newMessage = await sendMessage(selectedChat._id, text.trim());
          dispatch(addMessage(newMessage));
        }
      }

      setText("");
      // Optimistically reset our unread count for this chat
      dispatch(resetChatUnreadCount({ chatId: selectedChat._id, userId }));

      // Stop typing status
      socket.emit("stopTyping", { chatId: selectedChat._id, userId });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    } catch (err) {
      console.error("Failed to process message action:", err);
    }
  };

  const handleSendVoice = async () => {
    if (!audioBlob || !selectedChat) return;

    try {
      const formData = new FormData();
      formData.append("chatId", selectedChat._id);
      formData.append("file", audioBlob, "voice_message.webm");
      // Text is optional for voice messages

      const newMessage = await sendMessage(selectedChat._id, formData);
      dispatch(addMessage(newMessage));

      resetRecording();
    } catch (err) {
      console.error("Failed to send voice message:", err);
    }
  };

  const handleEditInit = (msg) => {
    setEditingMessage(msg);
    setText(msg.text);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setText("");
  };

  const handleProcessDelete = async (type) => {
    if (!deletingMessage) return;

    try {
      const updated = await deleteMessage(deletingMessage._id, type);

      if (type === "forMe") {
        // Just remove from local state
        dispatch(fetchMessages(selectedChat._id)); // Re-fetch or filter out
      } else {
        // forEveryone
        dispatch(updateMessage(updated));
        socket.emit("deleteMessage", updated);
      }

      setDeletingMessage(null);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  if (!selectedChat) {
    return (
      <div className={`flex flex-1 items-center justify-center text-gray-500 h-full ${theme === "dark" ? "bg-[#111827]" : "bg-white"}`}>
        <div className="text-center flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">Pick a chat to start</p>
          <p className="text-sm text-gray-400">Your messages will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 w-full h-full overflow-hidden">
      {/* HEADER */}
      <div className="sticky top-0 z-20 h-16 px-4 flex items-center justify-between border-b dark:border-zinc-700 bg-white dark:bg-[#0b1220] shrink-0 w-full">
        <div className="flex items-center gap-2">
          {/* Back Button for Mobile */}
          <button
            onClick={() => dispatch(setSelectedChat(null))}
            className="md:hidden p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <FiArrowLeft className="text-xl text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={otherUser?.avatar ? `${BASE_URL}${otherUser.avatar}` : "/avatar.png"}
              alt={otherUser?.username || "User"}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-zinc-700 shadow-sm"
            />
            {otherUser?.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayName}</p>
            <p className={`text-[11px] ${otherUser?.isOnline || isTyping ? "text-green-500 font-medium" : "text-gray-500 dark:text-gray-400"}`}>
              {isTyping ? "typing..." : (otherUser?.isOnline ? "Online" : formatLastSeen(otherUser?.lastSeen))}
            </p>
          </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-5 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          <FiSearch className="hidden sm:block" />
          <button onClick={() => callUser(otherUser?._id, 'audio', otherUser?.username)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <MdCall />
          </button>
          <button onClick={() => callUser(otherUser?._id, 'video', otherUser?.username)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <MdVideocam />
          </button>
          <FiMoreVertical className="cursor-pointer" />
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-[url('/chat-bg.png')] dark:bg-[#0b141a]">
        {messages.map((msg) => (
          <MessageItem
            key={msg._id}
            message={msg}
            isOwnMessage={(msg.sender?._id ? msg.sender._id.toString() : msg.sender?.toString())?.toLowerCase() === userId}
            onEdit={handleEditInit}
            onDelete={(msg) => setDeletingMessage(msg)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* EDITING INDICATOR */}
      {editingMessage && (
        <div className="px-4 py-2 bg-zinc-100 dark:bg-[#1f2c33] border-t dark:border-zinc-700 flex items-center justify-between duration-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-1 h-8 bg-sky-500 rounded-full shrink-0"></div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-bold text-sky-500 uppercase tracking-wider">Edit message</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate italic">"{editingMessage.text}"</span>
            </div>
          </div>
          <button
            onClick={cancelEdit}
            className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      )}

      {/* FILE PREVIEW */}
      {previewUrl && (
        <div className="px-4 py-2 bg-zinc-100 dark:bg-[#1f2c33] border-t dark:border-zinc-700 flex items-center justify-between duration-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded overflow-hidden bg-black/10">
              {selectedFile?.type.startsWith("image") ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs">Video</div>
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-bold text-sky-500 uppercase tracking-wider">Sending File</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{selectedFile.name}</span>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      )}

      {/* INPUT */}
      <div className="sticky bottom-0 z-20 h-16 px-2 sm:px-4 flex items-center gap-1.5 sm:gap-3 border-t dark:border-zinc-700 bg-white dark:bg-[#0b1220] shrink-0 w-full">
        <BsThreeDots className="text-xl hidden sm:block shrink-0" />
        <BsEmojiSmile className="text-xl hidden sm:block shrink-0" />

        {/* Gallery Option */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          hidden
          accept="image/*,video/*"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="hover:text-sky-500 transition-colors shrink-0"
          title="Attach Image/Video"
        >
          <FiImage className="text-xl" />
        </button>

        <div className="flex-1 relative flex items-center min-w-0">
          <input
            value={text}
            onChange={handleTextChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={editingMessage ? "Edit..." : "Type message..."}
            className="flex-1 min-w-0 px-3 py-2 rounded-full bg-[#f3f4f6] dark:bg-[#1f2937] outline-none text-xs sm:text-sm text-gray-900 dark:text-white border-transparent focus:border-sky-500/50 border transition-all"
            autoFocus={!!editingMessage}
          />
        </div>

        {/* Voice Recording UI */}
        <div
          className="flex items-center select-none touch-none"
          onMouseDown={!audioBlob && !isRecording && !isProcessing ? startRecording : undefined}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          onTouchStart={!audioBlob && !isRecording && !isProcessing ? startRecording : undefined}
          onTouchEnd={stopRecording}
        >
          {isRecording ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-red-600 dark:text-red-400 font-bold">{formattedTime}</span>
              <span className="text-[10px] text-red-600 dark:text-red-400 opacity-70">Release to send</span>
            </div>
          ) : isProcessing ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full">
              <div className="w-3 h-3 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
              <span className="text-xs text-zinc-500">Processing...</span>
            </div>
          ) : audioBlob ? (
            <div className="flex items-center gap-2 px-2" onMouseDown={(e) => e.stopPropagation()}>
              <button
                onClick={resetRecording}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                title="Discard"
              >
                <span className="text-xl">✕</span>
              </button>
              <div className="px-3 py-1.5 text-xs text-sky-500 font-medium">
                Voice ready
              </div>
            </div>
          ) : (
            <button
              className="hover:text-sky-500 transition-colors p-2 active:scale-95 transform transition-transform cursor-pointer"
              title="Hold to record voice message"
            >
              <MdMic className="text-2xl" />
            </button>
          )}
        </div>

        <button
          onClick={audioBlob ? handleSendVoice : handleSend}
          disabled={(!text.trim() && !selectedFile && !audioBlob) || isProcessing}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0
            bg-sky-400 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-600
          `}
          title={audioBlob ? "Send Voice Message" : "Send Message"}
        >
          <FiSend className="text-xl" />
        </button>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deletingMessage && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full sm:max-w-[320px] bg-white dark:bg-[#233138] rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Delete message?</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Are you sure you want to delete this message?
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleProcessDelete("forEveryone")}
                  className="w-full py-2.5 px-4 text-sm font-medium text-sky-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-100 dark:border-zinc-700/50"
                >
                  Delete for Everyone
                </button>
                <button
                  onClick={() => handleProcessDelete("forMe")}
                  className="w-full py-2.5 px-4 text-sm font-medium text-sky-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-100 dark:border-zinc-700/50"
                >
                  Delete for Me
                </button>
                <button
                  onClick={() => setDeletingMessage(null)}
                  className="w-full py-2.5 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default ChatWindow;
