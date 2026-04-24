import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAIConversations, setSelectedConversation, clearAIMessages, fetchAIMessages, renameAIConversation } from "../redux/slices/aiSlice";
import { FiPlus, FiMessageSquare, FiTrash2, FiMoreVertical, FiEdit3, FiCheck, FiX } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { deleteAIConversation } from "../services/ai.services";

const AIChatSidebar = () => {
    const dispatch = useDispatch();
    const { conversations, selectedConversation, loading, error } = useSelector((state) => state.ai);

    // Local state for menu and renaming
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const menuRef = useRef(null);

    useEffect(() => {
        dispatch(fetchAIConversations());
    }, [dispatch]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNewChat = () => {
        dispatch(setSelectedConversation(null));
        dispatch(clearAIMessages());
    };

    const handleSelectConversation = (conv) => {
        if (editingId) return; // Don't switch if renaming
        dispatch(setSelectedConversation(conv));
        dispatch(fetchAIMessages(conv._id));
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        setMenuOpenId(null);
        if (window.confirm("Are you sure you want to delete this chat?")) {
            await deleteAIConversation(id);
            dispatch(fetchAIConversations());
            if (selectedConversation?._id === id) {
                handleNewChat();
            }
        }
    };

    const handleStartRename = (e, conv) => {
        e.stopPropagation();
        setEditingId(conv._id);
        setEditValue(conv.title);
        setMenuOpenId(null);
    };

    const handleSaveRename = async (e) => {
        e.stopPropagation();
        if (editValue.trim()) {
            await dispatch(renameAIConversation({ conversationId: editingId, title: editValue }));
            setEditingId(null);
        }
    };

    const handleCancelRename = (e) => {
        e.stopPropagation();
        setEditingId(null);
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === id ? null : id);
    };

    return (
        <div className="w-full shrink-0 h-full flex flex-col border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0b1220] transition-all">
            {/* Header / New Chat */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-zinc-700 shrink-0">
                <h2 className="text-xl font-black text-sky-500 uppercase tracking-tighter">GIGA</h2>
                <button
                    onClick={handleNewChat}
                    className="p-2 rounded-full border border-sky-100 dark:border-zinc-600 transition hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 group"
                >
                    <FiPlus className="text-sky-500 dark:text-white group-hover:text-white transition-colors" />
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {error && (
                    <div className="p-3 m-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-[10px] rounded-lg border border-red-100 dark:border-red-900/30">
                        Giga Synapse Error: {error}
                    </div>
                )}
                {loading && conversations.length === 0 ? (
                    <div className="flex justify-center p-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
                    </div>
                ) : (
                    <div className="py-2">
                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-4 py-2 opacity-70">
                            Recent Synapses
                        </p>
                        {conversations.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">No history found</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv._id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`flex items-center gap-3 p-3 cursor-pointer transition-all border-b dark:border-zinc-800/50 group relative
                                        ${selectedConversation?._id === conv._id
                                            ? "bg-sky-50/50 dark:bg-sky-900/20 border-l-4 border-l-sky-500"
                                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sky-600 dark:text-white text-sm font-bold bg-sky-100 dark:bg-zinc-700 shadow-sm transition-all group-hover:scale-105 group-hover:bg-sky-200 dark:group-hover:bg-zinc-600`}>
                                            <FiMessageSquare />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-hidden">
                                        {editingId === conv._id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-800 border-sky-500 border rounded px-2 py-0.5 text-sm outline-none text-gray-900 dark:text-white"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveRename(e);
                                                        if (e.key === 'Escape') handleCancelRename(e);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <button onClick={handleSaveRename} className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                                                    <FiCheck />
                                                </button>
                                                <button onClick={handleCancelRename} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                                                    <FiX />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-sm truncate text-gray-900 dark:text-zinc-100">
                                                    {conv.title}
                                                </p>
                                                <p className="text-[11px] truncate text-gray-500 dark:text-gray-400 opacity-80">
                                                    {conv.lastMessage || "No messages yet"}
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* 3 Dots Menu Button */}
                                    <div className="relative shrink-0">
                                        <button
                                            onClick={(e) => toggleMenu(e, conv._id)}
                                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 transition-all active:scale-90"
                                        >
                                            <FiMoreVertical className="text-sm" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {menuOpenId === conv._id && (
                                            <div
                                                ref={menuRef}
                                                className="absolute right-0 mt-1 w-40 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-100 dark:border-zinc-700 z-[100] py-1.5 animate-in fade-in zoom-in-95 duration-200"
                                            >
                                                <button
                                                    onClick={(e) => handleStartRename(e, conv)}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-left transition-colors font-medium"
                                                >
                                                    <FiEdit3 className="text-sky-500" />
                                                    Rename Chat
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, conv._id)}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors font-medium"
                                                >
                                                    <FiTrash2 className="text-red-500" />
                                                    Delete Chat
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t dark:border-zinc-800 bg-white dark:bg-[#0b1220] transition-colors">
                <div className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 transition-transform group-hover:scale-110">
                            <RiRobot2Line className="text-xl" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0b1220] rounded-full animate-pulse"></span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight">Pulse Master Control</p>
                        <p className="text-[10px] text-green-500 font-bold opacity-80">Link Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatSidebar;
