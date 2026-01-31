import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import useTheme from "../hooks/useTheme";
import { getStatusFeed } from "../services/status.services";
import { getChannels } from "../services/channel.services";

const UpdatesSidebar = ({ onStatusSelect, onChannelSelect, onPostStatus, onCreateChannel, activeChannel }) => {
    const { theme } = useTheme();
    const [statuses, setStatuses] = useState([]);
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);

    const auth = JSON.parse(localStorage.getItem("auth"));
    const currentUser = auth?.user;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statusData, channelData] = await Promise.all([
                    getStatusFeed(),
                    getChannels()
                ]);
                setStatuses(statusData);
                setChannels(channelData);
            } catch (err) {
                console.error("Failed to fetch updates:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Group statuses by user for display
    const userStatuses = statuses.reduce((acc, s) => {
        const uid = s.user?._id;
        if (!acc[uid]) acc[uid] = { ...s.user, status: [] };
        acc[uid].status.push(s);
        return acc;
    }, {});

    const myStatuses = statuses.filter(s => s.user?._id === currentUser?._id);
    const otherUserStatuses = Object.values(userStatuses).filter(u => u._id !== currentUser?._id);

    const getAvatar = (user) => {
        if (!user?.avatar) return "https://i.pravatar.cc/150";
        if (user.avatar.startsWith("http")) return user.avatar;
        return `http://localhost:5000${user.avatar}`;
    };

    return (
        <div className="w-[350px] flex flex-col h-full bg-white dark:bg-[#111b21] border-r dark:border-zinc-700/50">
            {/* HEADER */}
            <div className="p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-100 italic">Updates</h1>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* STATUS SECTION */}
                <section className="px-4 py-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-sky-500 tracking-wide uppercase">Updates</h2>
                    </div>

                    {/* MY STATUS */}
                    <div className="flex items-center gap-4 py-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors rounded-lg group">
                        <div className="relative" onClick={() => myStatuses.length > 0 ? onStatusSelect(myStatuses[0]) : onPostStatus()}>
                            <img
                                src={getAvatar(currentUser)}
                                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
                                alt="Me"
                            />
                            <div
                                onClick={(e) => { e.stopPropagation(); onPostStatus(); }}
                                className="absolute bottom-0 right-0 w-4 h-4 bg-sky-500 rounded-full border-2 border-white dark:border-[#111b21] flex items-center justify-center hover:scale-110 transition-transform"
                            >
                                <FiPlus className="text-white text-[10px]" />
                            </div>
                        </div>
                        <div className="flex-1" onClick={() => myStatuses.length > 0 ? onStatusSelect(myStatuses[0]) : onPostStatus()}>
                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">My updates</p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                {myStatuses.length > 0 ? "Tap to view update" : "Tap to add an update"}
                            </p>
                        </div>
                    </div>

                    <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mt-6 mb-3 font-medium uppercase tracking-tight">Recent updates</p>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-xs text-zinc-400 animate-pulse">Loading updates...</div>
                        ) : otherUserStatuses.length === 0 ? (
                            <p className="text-xs text-zinc-400 italic py-2">No updates yet</p>
                        ) : (
                            otherUserStatuses.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => onStatusSelect(user.status[0])}
                                    className="flex items-center gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors rounded-lg py-1"
                                >
                                    <div className="p-[2px] rounded-full border-2 border-sky-500">
                                        <img
                                            src={getAvatar(user)}
                                            className="w-11 h-11 rounded-full object-cover border border-white dark:border-[#111b21]"
                                            alt={user.username}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">{user.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                                            {new Date(user.status[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <div className="h-[1px] bg-zinc-100 dark:bg-zinc-700/50 mx-4 my-6"></div>

                {/* CHANNELS SECTION */}
                <section className="px-4 py-2 pb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-sky-500 tracking-wide uppercase">Channels</h2>
                        <button
                            onClick={onCreateChannel}
                            className="p-2 rounded-full border border-blue-300 dark:border-zinc-600 transition hover:bg-[#1982c4] hover:text-white dark:hover:bg-[#1982c4] group"
                            title="Create Channel"
                        >
                            <FiPlus className="text-gray-900 dark:text-white group-hover:text-white" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        {channels.length === 0 ? (
                            <p className="text-xs text-zinc-400 italic py-2 px-2">No channels found</p>
                        ) : (
                            channels.map((channel) => (
                                <div
                                    key={channel._id}
                                    onClick={() => onChannelSelect(channel)}
                                    className={`flex items-center gap-4 p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all rounded-xl ${activeChannel?._id === channel._id ? "bg-zinc-100 dark:bg-zinc-800/50" : ""
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-lg border dark:border-sky-500/20 shadow-sm overflow-hidden">
                                        {channel.avatar ? (
                                            <img
                                                src={channel.avatar.startsWith("http") ? channel.avatar : `http://localhost:5000${channel.avatar}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (channel.name ? channel.name[0] : "?")}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate">{channel.name}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">{channel.description || "Official Channel"}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UpdatesSidebar;
