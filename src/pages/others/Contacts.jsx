import React, { useState, useEffect, useContext } from "react";
import { getAllUsers } from "../../services/userService";
import { getCallHistory } from "../../services/callService";
import { createChat } from "../../services/chat.services";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../redux/slices/chatSlice";
import { CallingContext } from "../../context/CallingContext";
import { FiSearch, FiMessageSquare, FiPhone, FiVideo, FiPlus, FiClock, FiVideoOff, FiPhoneMissed } from "react-icons/fi";
import { BsPersonPlus, BsTelephone, BsCameraVideo } from "react-icons/bs";
import { BASE_URL } from "../../config";

const Contacts = () => {
    const { callUser } = useContext(CallingContext);
    const [users, setUsers] = useState([]);
    const [calls, setCalls] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, callsData] = await Promise.all([
                    getAllUsers(),
                    getCallHistory()
                ]);
                setUsers(usersData);
                setCalls(callsData);
            } catch {
                console.error("GIGUP Sync Error: Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStartChat = async (user) => {
        try {
            const chat = await createChat(user.email, user.username);
            dispatch(setSelectedChat(chat));
            navigate("/chat");
        } catch (err) {
            console.error("Error creating chat:", err);
        }
    };

    const handleCall = (user, type) => {
        callUser(user._id, type, user.username);
    };

    const audioCalls = calls.filter(c => c.type === 'audio');
    const videoCalls = calls.filter(c => c.type === 'video');

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const HistoryItem = ({ call }) => {
        const auth = JSON.parse(localStorage.getItem("auth"));
        const isCaller = call.caller?._id === auth?.user?._id;
        const otherParty = isCaller ? call.receiver : call.caller;

        return (
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 hover:border-sky-500/30 transition-all group">
                <div className="flex items-center gap-3">
                    <img
                        src={otherParty?.avatar ? `${BASE_URL}${otherParty.avatar}` : "/avatar.png"}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                        <h4 className="text-sm font-bold truncate dark:text-zinc-200">{otherParty?.username}</h4>
                        <div className="flex items-center gap-1.5 opacity-60">
                            {call.status === 'missed' ? (
                                <span className="text-red-500 flex items-center gap-1 text-[10px] font-bold uppercase">
                                    <FiPhoneMissed className="text-xs" /> Missed
                                </span>
                            ) : (
                                <span className="text-green-500 flex items-center gap-1 text-[10px] font-bold uppercase">
                                    <FiClock className="text-xs" /> {Math.floor(call.duration / 60)}m {call.duration % 60}s
                                </span>
                            )}
                            <span className="text-[10px]">•</span>
                            <span className="text-[10px] font-medium">{new Date(call.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => handleCall(otherParty, call.type)}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-sky-500 text-white transition-all shadow-lg shadow-sky-500/20"
                >
                    <FiPlus />
                </button>
            </div>
        );
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-[#0b1220]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"></div>
            <p className="text-sky-500 font-black uppercase tracking-widest text-xs">Syncing Hub...</p>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row h-full w-full bg-white dark:bg-[#0b1220] overflow-hidden">
            {/* PART 1: CONTACTS SIDEBAR */}
            <div className="w-full md:w-[350px] shrink-0 border-r dark:border-zinc-700 flex flex-col h-full bg-zinc-50/50 dark:bg-black/20">
                <div className="p-6 border-b dark:border-zinc-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-sky-500 uppercase tracking-tighter leading-none">Contacts</h2>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Active Sync</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Find peers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border-none outline-none text-sm shadow-sm focus:ring-1 focus:ring-sky-500/50 transition-all font-medium dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar pb-6">
                    {filteredUsers.map((u) => (
                        <div key={u._id} className="group flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1f2937]/50 hover:bg-white dark:hover:bg-[#1f2937] border border-zinc-100 dark:border-zinc-800/50 hover:border-sky-500/30 transition-all cursor-pointer shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src={u.avatar ? `${BASE_URL}${u.avatar}` : "/avatar.png"}
                                        alt={u.username}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-zinc-700"
                                    />
                                    {u.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0b1220] rounded-full"></span>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate">{u.username}</h3>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleCall(u, 'audio')} className="text-sky-500 hover:text-sky-600 transition-colors"><FiPhone className="text-xs" /></button>
                                        <button onClick={() => handleCall(u, 'video')} className="text-indigo-500 hover:text-indigo-600 transition-colors"><FiVideo className="text-xs" /></button>
                                        <button onClick={() => handleStartChat(u)} className="text-zinc-400 hover:text-sky-500 transition-colors"><FiMessageSquare className="text-xs" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PART 2 & 3: CALL HISTORY HUB (Audio & Video) - hidden on mobile */}
            <div className="hidden md:flex flex-1 flex-row overflow-hidden bg-white dark:bg-[#0b1220]">
                {/* Audio History */}
                <div className="flex-1 flex flex-col border-r dark:border-zinc-700 overflow-hidden">
                    <div className="p-6 border-b dark:border-zinc-700 flex items-center justify-between bg-zinc-50/30 dark:bg-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-500 shadow-sm border border-sky-100 dark:border-sky-500/20">
                                <BsTelephone className="text-xl" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Audio History</h2>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{audioCalls.length} logs synchronized</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {audioCalls.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <BsTelephone className="text-6xl mb-3" />
                                <p className="text-xs font-black uppercase tracking-widest">No audio logs found</p>
                            </div>
                        ) : (
                            audioCalls.map(call => <HistoryItem key={call._id} call={call} />)
                        )}
                    </div>
                </div>

                {/* Video History */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b dark:border-zinc-700 flex items-center justify-between bg-zinc-50/30 dark:bg-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                                <BsCameraVideo className="text-xl" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Video History</h2>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{videoCalls.length} logs synchronized</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {videoCalls.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <BsCameraVideo className="text-6xl mb-3" />
                                <p className="text-xs font-black uppercase tracking-widest">No video logs found</p>
                            </div>
                        ) : (
                            videoCalls.map(call => <HistoryItem key={call._id} call={call} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacts;
