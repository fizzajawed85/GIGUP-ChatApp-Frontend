import { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupMessages, addGroupMessage, markGroupMessageAsRead, markAllGroupMessagesAsRead } from "../redux/slices/groupMessageSlice";
import { socket } from "../utils/socket";
import { sendGroupMessage, leaveGroup, markMessageAsRead } from "../services/group.services";
import { removeGroup, resetGroupUnreadCount, setSelectedGroup } from "../redux/slices/groupSlice";
import GroupMessageItem from "./GroupMessageItem";
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
import { MdCall, MdVideocam, MdMic, MdExitToApp } from "react-icons/md";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";

const GroupWindow = () => {
    const dispatch = useDispatch();
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);

    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { theme } = useTheme();
    const { startGroupCall } = useContext(CallingContext);
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
    const { selectedGroup } = useSelector((state) => state.group);
    const { messages } = useSelector((state) => state.groupMessage);

    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const userId = auth?.user?._id?.toString()?.toLowerCase();
    const username = auth?.user?.username;


    useEffect(() => {
        if (selectedGroup?._id) {
            console.log("Joining group room:", selectedGroup._id);
            socket.emit("joinGroup", selectedGroup._id);

            return () => {
                console.log("Leaving group room:", selectedGroup._id);
                socket.emit("leaveGroup", selectedGroup._id);
            };
        }
    }, [selectedGroup?._id]);

    // Separate effect for marking as read
    useEffect(() => {
        if (selectedGroup?._id) {
            console.log(">>> GroupWindow: Resetting unread count local for:", selectedGroup._id);
            // Always reset local unread count when opening a group
            dispatch(resetGroupUnreadCount({ groupId: selectedGroup._id, userId }));

            if (messages.length > 0) {
                const latestMsg = messages[messages.length - 1];
                const hasRead = latestMsg.readBy?.some(id => id.toString().toLowerCase() === userId);
                console.log(">>> GroupWindow: Latest message read state:", hasRead);
                if (!hasRead) {
                    console.log(">>> GroupWindow: Calling markMessageAsRead API for group:", selectedGroup._id);
                    markMessageAsRead(selectedGroup._id, latestMsg._id)
                        .catch(err => console.error("Failed to mark as read:", err));
                }
            }
        }
    }, [selectedGroup?._id, messages, userId, dispatch]);

    useEffect(() => {
        const handleGroupMessage = (message) => {
            dispatch(addGroupMessage(message));
        };

        const handleGroupTyping = ({ userId: typingUserId, username: typingUsername }) => {
            setTypingUsers((prev) => {
                if (!prev.find((u) => u.userId === typingUserId)) {
                    return [...prev, { userId: typingUserId, username: typingUsername }];
                }
                return prev;
            });
        };

        const handleGroupStopTyping = ({ userId: typingUserId }) => {
            setTypingUsers((prev) => prev.filter((u) => u.userId !== typingUserId));
        };

        const handleGroupMessageRead = ({ messageId, userId }) => {
            dispatch(markGroupMessageAsRead({ messageId, userId }));
        };

        const handleGroupAllMessagesRead = ({ userId }) => {
            dispatch(markAllGroupMessagesAsRead({ userId }));
        };

        socket.on("groupMessage", handleGroupMessage);
        socket.on("groupTyping", handleGroupTyping);
        socket.on("groupStopTyping", handleGroupStopTyping);
        socket.on("groupMessageRead", handleGroupMessageRead);
        socket.on("groupAllMessagesRead", handleGroupAllMessagesRead);

        return () => {
            socket.off("groupMessage", handleGroupMessage);
            socket.off("groupTyping", handleGroupTyping);
            socket.off("groupStopTyping", handleGroupStopTyping);
            socket.off("groupMessageRead", handleGroupMessageRead);
            socket.off("groupAllMessagesRead", handleGroupAllMessagesRead);
        };
    }, [dispatch]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleTyping = (e) => {
        setText(e.target.value);

        if (!isTyping && selectedGroup) {
            setIsTyping(true);
            socket.emit("groupTyping", { groupId: selectedGroup._id, userId, username });
        }

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit("groupStopTyping", { groupId: selectedGroup._id, userId });
        }, 1000);
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

    const handleSendVoice = async () => {
        if (!audioBlob || !selectedGroup) return;

        try {
            const formData = new FormData();
            formData.append("groupId", selectedGroup._id);
            formData.append("file", audioBlob, "voice-message.webm");
            // Text is optional for voice messages

            const newMessage = await sendGroupMessage(selectedGroup._id, formData);
            dispatch(addGroupMessage(newMessage));

            resetRecording();
        } catch (err) {
            console.error("Failed to send voice message:", err);
        }
    };

    const handleSend = async () => {
        if ((!text.trim() && !selectedFile) || !selectedGroup) return;

        const messageContent = text.trim();
        const tempId = Date.now().toString();
        const optimisticMessage = {
            _id: tempId,
            tempId,
            text: messageContent,
            sender: { _id: userId, username, avatar: auth?.user?.avatar },
            group: selectedGroup._id,
            status: "sending",
            createdAt: new Date().toISOString(),
            readBy: [userId]
        };

        try {
            if (selectedFile) {
                // For files, we might not show optimistic text immediately or show a placeholder
                const formData = new FormData();
                formData.append("text", messageContent);
                formData.append("file", selectedFile);

                dispatch(addGroupMessage({ ...optimisticMessage, text: messageContent || "Sending file..." }));
                const response = await sendGroupMessage(selectedGroup._id, formData);
                dispatch(addGroupMessage({ ...response, tempId }));
                clearFile();
            } else {
                dispatch(addGroupMessage(optimisticMessage));
                const response = await sendGroupMessage(selectedGroup._id, messageContent);
                dispatch(addGroupMessage({ ...response, tempId }));
            }

            setText("");
            socket.emit("groupStopTyping", { groupId: selectedGroup._id, userId });

        } catch (error) {
            console.error("Failed to send message:", error);
            // Could add logic to mark optimistic message as "failed"
        }
    };

    const handleLeaveGroup = async () => {
        if (!selectedGroup) return;

        const confirmed = window.confirm(`Are you sure you want to leave "${selectedGroup.name}"?`);
        if (!confirmed) return;

        try {
            await leaveGroup(selectedGroup._id);
            dispatch(removeGroup(selectedGroup._id));
            setShowMenu(false);
        } catch (error) {
            console.error("Failed to leave group:", error);
            alert("Failed to leave group");
        }
    };

    if (!selectedGroup) {
        return (
            <div className={`flex flex-1 items-center justify-center text-gray-500 h-full ${theme === "dark" ? "bg-[#111827]" : "bg-white"}`}>
                <div className="text-center flex flex-col items-center justify-center">
                    <p className="text-xl font-semibold">Select a group to start</p>
                    <p className="text-sm text-gray-400">Your group messages will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 min-w-0 h-full">
            {/* HEADER */}
            <div className="h-16 px-4 flex items-center justify-between border-b dark:border-zinc-700 bg-white dark:bg-[#0b1220] shrink-0">
                <div className="flex items-center gap-2">
                    {/* Back Button for Mobile */}
                    <button
                        onClick={() => dispatch(setSelectedGroup(null))}
                        className="md:hidden p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <FiArrowLeft className="text-xl text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold overflow-hidden shrink-0 border border-gray-200 dark:border-zinc-700 shadow-sm">
                        {selectedGroup.avatar ? (
                            <img
                                src={selectedGroup.avatar.startsWith("http") ? selectedGroup.avatar : `${BASE_URL}${selectedGroup.avatar}`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            selectedGroup.name[0]?.toUpperCase()
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{selectedGroup.name}</h3>
                        <p className={`text-[11px] ${typingUsers.length > 0 ? "text-green-500 font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                            {typingUsers.length > 0
                                ? `${typingUsers.map((u) => u.username).join(", ")} typing...`
                                : `${selectedGroup.members?.length || 0} members`}
                        </p>
                    </div>
                </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-5 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                    <FiSearch className="hidden sm:block" />
                    <button
                        onClick={() => callUser(selectedGroup?._id, 'audio', selectedGroup?.name)}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <MdCall />
                    </button>
                    <button
                        onClick={() => callUser(selectedGroup?._id, 'video', selectedGroup?.name)}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <MdVideocam />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center justify-center hover:text-sky-500 transition-colors p-2"
                        >
                            <FiMoreVertical />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border dark:border-zinc-700 py-1 z-10 text-sm">
                                <button
                                    onClick={handleLeaveGroup}
                                    className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                                >
                                    <MdExitToApp className="text-lg" />
                                    Leave Group
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-[url('/chat-bg.png')] dark:bg-[#0b141a]">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 dark:text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <GroupMessageItem
                            key={msg._id}
                            message={msg}
                            currentUserId={userId}
                            membersCount={selectedGroup.members?.length || 0}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* FILE PREVIEW */}
            {previewUrl && (
                <div className="px-4 py-2 bg-zinc-100 dark:bg-[#1f2c33] border-t dark:border-zinc-700 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
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
            <div className="h-16 px-4 flex items-center gap-3 border-t dark:border-zinc-700 bg-white dark:bg-[#0b1220] shrink-0">
                <BsThreeDots className="text-xl hidden sm:block" />
                <BsEmojiSmile className="text-xl hidden sm:block" />

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
                    className="hover:text-sky-500 transition-colors"
                    title="Attach Image/Video"
                >
                    <FiImage className="text-xl" />
                </button>

                <input
                    value={text}
                    onChange={handleTyping}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full bg-[#f3f4f6] dark:bg-[#1f2937] outline-none text-sm text-gray-900 dark:text-white"
                />

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
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                        bg-sky-400 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-600
                    `}
                    title={audioBlob ? "Send Voice Message" : "Send Message"}
                >
                    <FiSend />
                </button>
            </div>
        </div>
    );
};

export default GroupWindow;
