import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { markStatusViewed } from "../services/status.services";

const StatusViewer = ({ status, onClose }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!status) return;

        // Mark as viewed
        markStatusViewed(status._id).catch(err => console.error("Failed to mark seen:", err));

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    onClose();
                    return 100;
                }
                return prev + 1;
            });
        }, 50); // 5 seconds total

        return () => clearInterval(timer);
    }, [status, onClose]);

    if (!status) return null;

    const getAvatar = (user) => {
        if (!user?.avatar) return "https://i.pravatar.cc/150";
        if (user.avatar.startsWith("http")) return user.avatar;
        return `http://localhost:5000${user.avatar}`;
    };

    return (
        <div className="flex-1 flex flex-col bg-black relative animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
            {/* PROGRESS BAR */}
            <div className="absolute top-4 left-0 right-0 px-4 flex gap-1 z-20">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-sky-400 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* HEADER */}
            <div className="absolute top-10 left-6 right-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                    <img src={getAvatar(status.user)} className="w-10 h-10 rounded-full border border-white/50" alt="" />
                    <div className="text-white">
                        <p className="text-sm font-bold">{status.user?.username || "Admin"}</p>
                        <p className="text-[11px] opacity-70">
                            {new Date(status.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <IoClose className="text-3xl" />
                </button>
            </div>

            {/* CONTENT */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Dynamic Background */}
                <div
                    className="absolute inset-0 opacity-40 blur-3xl scale-110 transition-all duration-700"
                    style={{ backgroundColor: status.type === "text" ? status.backgroundColor : "#000" }}
                ></div>

                {status.type === "text" ? (
                    <div
                        className="relative z-10 w-full h-full flex items-center justify-center p-12 text-center"
                        style={{ backgroundColor: status.backgroundColor }}
                    >
                        <p className="text-white text-4xl md:text-5xl font-black leading-tight drop-shadow-xl max-w-2xl animate-in zoom-in-90 duration-500">
                            {status.content}
                        </p>
                    </div>
                ) : (
                    <div className="relative z-10 max-w-full max-h-full p-6 flex items-center justify-center">
                        {status.type === "video" ? (
                            <video
                                src={status.content.startsWith("http") ? status.content : `http://localhost:5000${status.content}`}
                                autoPlay
                                className="rounded-2xl shadow-2xl max-h-[80vh] object-contain border-4 border-white/10 ring-1 ring-white/20 animate-in zoom-in-95 duration-500"
                            />
                        ) : (
                            <img
                                src={status.content.startsWith("http") ? status.content : `http://localhost:5000${status.content}`}
                                className="rounded-2xl shadow-2xl max-h-[80vh] object-contain border-4 border-white/10 ring-1 ring-white/20 animate-in zoom-in-95 duration-500"
                                alt="Update"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusViewer;
