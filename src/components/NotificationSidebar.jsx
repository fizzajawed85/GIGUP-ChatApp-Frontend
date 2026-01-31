import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import {
    FiX,
    FiBell,
    FiMessageCircle,
    FiPhone,
    FiCpu,
    FiTrash2,
    FiCheckSquare
} from "react-icons/fi";
import { BsLightningCharge } from "react-icons/bs";

const NotificationSidebar = () => {
    const {
        notifications,
        isSidebarOpen,
        toggleSidebar,
        markAllAsRead,
        clearAll
    } = useContext(NotificationContext);

    if (!isSidebarOpen) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'message': return <FiMessageCircle className="text-sky-500" />;
            case 'group': return <FiMessageCircle className="text-sky-500" />;
            case 'call': return <FiPhone className="text-green-500" />;
            case 'ai': return <FiCpu className="text-indigo-500" />;
            case 'system': return <FiBell className="text-sky-500" />;
            default: return <FiBell className="text-zinc-400" />;
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-[150] shadow-2xl flex flex-col bg-white dark:bg-[#0b1220] border-l dark:border-white/5 animate-in slide-in-from-right duration-300">
            {/* HEADER */}
            <div className="p-6 border-b dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-500">
                        <FiBell className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Live Signals</h3>
                        <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest flex items-center gap-1">
                            <BsLightningCharge className="text-xs" /> System Active
                        </p>
                    </div>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 transition-colors"
                >
                    <FiX className="text-2xl" />
                </button>
            </div>

            {/* ACTIONS */}
            <div className="px-6 py-3 flex items-center gap-2 border-b dark:border-white/5">
                <button
                    onClick={markAllAsRead}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full bg-zinc-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-sky-500 transition-all"
                >
                    <FiCheckSquare /> Mark Read
                </button>
                <button
                    onClick={clearAll}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full bg-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                    <FiTrash2 /> Clear All
                </button>
            </div>

            {/* NOTIFICATIONS LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                        <FiBell className="text-6xl mb-4" />
                        <h4 className="text-sm font-black uppercase tracking-[0.2em]">Silence Detected</h4>
                        <p className="text-[10px] uppercase font-bold mt-1">No new signals in current session</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-[24px] border transition-all ${notif.read
                                ? "bg-white dark:bg-white/5 border-zinc-100 dark:border-white/5"
                                : "bg-sky-50/50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/30"
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`p-2.5 rounded-xl border ${notif.read
                                    ? "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10"
                                    : "bg-white dark:bg-[#0b1220] border-sky-400/30 shadow-lg shadow-sky-500/10"
                                    }`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h5 className="text-xs font-black dark:text-white uppercase tracking-tight truncate">{notif.title}</h5>
                                        <span className="text-[9px] font-bold text-zinc-400">
                                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                        {notif.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t dark:border-white/5 text-center bg-zinc-50/30 dark:bg-black/10">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em]">GIGUP Global Signal Unit</p>
            </div>
        </div>
    );
};

export default NotificationSidebar;
