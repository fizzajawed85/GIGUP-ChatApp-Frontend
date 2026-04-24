import React, { useState, useEffect, useContext } from "react";
import { getCallHistory } from "../../services/callService";
import { CallingContext } from "../../context/CallingContext";
import {
    FiSearch,
    FiPhone,
    FiVideo,
    FiClock,
    FiPhoneIncoming,
    FiPhoneOutgoing,
    FiPhoneMissed,
    FiFilter,
    FiRefreshCcw
} from "react-icons/fi";
import { BsTelephone, BsCameraVideo } from "react-icons/bs";
import { BASE_URL } from "../../config";

const Calls = () => {
    const { callUser } = useContext(CallingContext);
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // all, missed, incoming, outgoing

    const auth = JSON.parse(localStorage.getItem("auth"));
    const currentUserId = auth?.user?._id;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await getCallHistory();
            setCalls(data);
        } catch (err) {
            console.error("GIGUP Sync Error: Failed to load calls");
        } finally {
            setLoading(false);
        }
    };

    const handleRedial = (call) => {
        const otherParty = call.caller?._id === currentUserId ? call.receiver : call.caller;
        if (otherParty) {
            callUser(otherParty._id, call.type, otherParty.username);
        }
    };

    const filteredCalls = calls.filter(call => {
        const otherParty = call.caller?._id === currentUserId ? call.receiver : call.caller;
        const nameMatch = otherParty?.username?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!nameMatch) return false;

        if (activeFilter === "all") return true;
        if (activeFilter === "missed") return call.status === "missed";
        if (activeFilter === "incoming") return call.receiver?._id === currentUserId;
        if (activeFilter === "outgoing") return call.caller?._id === currentUserId;
        return true;
    });

    const CallItem = ({ call }) => {
        const isOutgoing = call.caller?._id === currentUserId;
        const otherParty = isOutgoing ? call.receiver : call.caller;
        const isMissed = call.status === "missed";

        return (
            <div className="flex items-center justify-between p-4 rounded-[24px] bg-white dark:bg-[#1f2937]/30 border border-zinc-100 dark:border-white/5 hover:border-sky-500/30 transition-all group shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={otherParty?.avatar ? `${BASE_URL}${otherParty.avatar}` : "/avatar.png"}
                            alt="User"
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-zinc-700"
                        />
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-[#0b1220] border border-zinc-100 dark:border-white/10`}>
                            {isMissed ? (
                                <FiPhoneMissed className="text-[10px] text-red-500" />
                            ) : isOutgoing ? (
                                <FiPhoneOutgoing className="text-[10px] text-sky-500" />
                            ) : (
                                <FiPhoneIncoming className="text-[10px] text-green-500" />
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <h4 className="text-sm font-black dark:text-zinc-100 truncate flex items-center gap-2">
                            {otherParty?.username}
                            {call.type === 'video' ? <FiVideo className="text-xs text-indigo-500" /> : <FiPhone className="text-xs text-sky-500" />}
                        </h4>
                        <div className="flex items-center gap-2 opacity-60">
                            <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <FiClock className="text-xs" />
                                {isMissed ? "Missed" : (call.status === 'declined' ? "Declined" : `${Math.floor(call.duration / 60)}m ${call.duration % 60}s`)}
                            </span>
                            <span className="text-[10px]">•</span>
                            <span className="text-[10px] font-medium">{new Date(call.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => handleRedial(call)}
                    className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-sky-500 hover:text-white shadow-lg shadow-sky-500/10 active:scale-95"
                >
                    <FiRefreshCcw className="text-lg" />
                </button>
            </div>
        );
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-[#0b1220]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"></div>
            <p className="text-sky-500 font-black uppercase tracking-widest text-xs">Syncing Logs...</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-[#0b1220] overflow-hidden">
            {/* HUB HEADER */}
            <div className="px-4 md:px-8 py-5 md:py-8 border-b dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/30 dark:bg-black/20">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1 md:mb-2">Calls Hub</h2>
                    <p className="text-xs font-bold text-sky-500 uppercase tracking-[0.3em]">Communication Network Active</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Find logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#111727] border-none outline-none text-sm shadow-sm focus:ring-2 focus:ring-sky-500/50 transition-all font-medium dark:text-white"
                        />
                    </div>

                    <button
                        onClick={fetchHistory}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#111727] text-zinc-400 hover:text-sky-500 transition-all shadow-sm border border-zinc-100 dark:border-white/5 active:scale-95"
                    >
                        <FiRefreshCcw />
                    </button>
                </div>
            </div>

            {/* FILTERS */}
            <div className="px-4 md:px-8 py-3 md:py-4 border-b dark:border-zinc-800 flex items-center gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
                {[
                    { id: "all", label: "All Logs", icon: FiFilter },
                    { id: "missed", label: "Missed", icon: FiPhoneMissed },
                    { id: "incoming", label: "Incoming", icon: FiPhoneIncoming },
                    { id: "outgoing", label: "Outgoing", icon: FiPhoneOutgoing },
                ].map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${activeFilter === filter.id
                            ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                            : "bg-zinc-100 dark:bg-[#111727] text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                            }`}
                    >
                        <filter.icon className="text-sm" />
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* CALLS LIST */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-8 space-y-3 md:space-y-4 custom-scrollbar">
                {filteredCalls.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-600">
                        <BsTelephone className="text-8xl mb-6 opacity-20" />
                        <h3 className="text-xl font-black uppercase tracking-widest opacity-40 text-center">No Signals Detected</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-30">The archive is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                        {filteredCalls.map(call => (
                            <CallItem key={call._id} call={call} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calls;
