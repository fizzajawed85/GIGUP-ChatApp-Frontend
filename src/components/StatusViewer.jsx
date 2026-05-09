import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { markStatusViewed } from "../services/status.services";
import { BASE_URL } from "../config";

const StatusViewer = ({ statuses = [], onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const currentStatus = statuses[currentIndex];

    const handleNext = () => {
        if (currentIndex < statuses.length - 1) {
            setProgress(0);
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setProgress(0);
            setCurrentIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        if (!currentStatus) return;

        // Mark as viewed
        markStatusViewed(currentStatus._id).catch(err => console.error("Failed to mark seen:", err));

        // Dynamic duration: 5s for text/image, 30s for videos
        const duration = currentStatus.type === "video" ? 30000 : 5000;
        const intervalTime = duration / 100;

        const goNext = () => {
            if (currentIndex < statuses.length - 1) {
                setProgress(0);
                setCurrentIndex(prev => prev + 1);
            } else {
                onClose();
            }
        };

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    goNext();
                    return 100;
                }
                return prev + 1;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [currentIndex, currentStatus, onClose, statuses.length]);

    if (!currentStatus) return null;

    const getAvatar = (user) => {
        if (!user?.avatar) return "https://i.pravatar.cc/150";
        if (user.avatar.startsWith("http")) return user.avatar;
        return `${BASE_URL}${user.avatar}`;
    };

    return (
        <div className="flex-1 flex flex-col bg-black relative animate-in fade-in zoom-in-95 duration-500 overflow-hidden group">
            {/* PROGRESS BARS */}
            <div className="absolute top-4 left-0 right-0 px-4 flex gap-2 z-30">
                {statuses.map((_, idx) => (
                    <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-sky-400 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                            style={{
                                width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%"
                            }}
                        ></div>
                    </div>
                ))}
            </div>

            {/* HEADER */}
            <div className="absolute top-10 left-6 right-6 flex justify-between items-center z-30">
                <div className="flex items-center gap-3">
                    <img src={getAvatar(currentStatus.user)} className="w-10 h-10 rounded-full border border-white/50" alt="" />
                    <div className="text-white">
                        <p className="text-sm font-bold">{currentStatus.user?.username || "Admin"}</p>
                        <p className="text-[11px] opacity-70">
                            {new Date(currentStatus.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({currentIndex + 1}/{statuses.length})
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

            {/* NAVIGATION AREAS */}
            <div className="absolute inset-0 z-20 flex">
                <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev}></div>
                <div className="w-2/3 h-full cursor-pointer" onClick={handleNext}></div>
            </div>

            {/* CONTENT */}
            <div className="relative w-full h-full flex items-center justify-center">
                <div
                    className="absolute inset-0 opacity-40 blur-3xl scale-110 transition-all duration-700"
                    style={{ backgroundColor: currentStatus.type === "text" ? currentStatus.backgroundColor : "#000" }}
                ></div>

                {currentStatus.type === "text" ? (
                    <div
                        className="relative z-10 w-full h-full flex items-center justify-center p-12 text-center"
                        style={{ backgroundColor: currentStatus.backgroundColor }}
                    >
                        <p className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-xl max-w-2xl animate-in zoom-in-90 duration-500 px-6">
                            {currentStatus.content}
                        </p>
                    </div>
                ) : (
                    <div className="relative z-10 max-w-full max-h-full p-6 flex items-center justify-center">
                        {currentStatus.type === "video" ? (
                            <video
                                src={currentStatus.content.startsWith("http") ? currentStatus.content : `${BASE_URL}${currentStatus.content}`}
                                autoPlay
                                muted
                                playsInline
                                className="rounded-2xl shadow-2xl max-h-[80vh] object-contain border-4 border-white/10 ring-1 ring-white/20 animate-in zoom-in-95 duration-500"
                            />
                        ) : (
                            <img
                                src={currentStatus.content.startsWith("http") ? currentStatus.content : `${BASE_URL}${currentStatus.content}`}
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
