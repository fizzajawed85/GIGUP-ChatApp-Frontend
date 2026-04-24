import React from "react";
import { BsCheckAll, BsCheck } from "react-icons/bs";
import VoiceMessagePlayer from "./VoiceMessagePlayer";
import useTheme from "../hooks/useTheme";
import { BASE_URL } from "../config";

const GroupMessageItem = ({ message, currentUserId, membersCount }) => {
    const { theme } = useTheme();
    const isOwnMessage = message.sender?._id === currentUserId;

    const renderContent = () => {
        if (message.isDeleted) {
            return (
                <p className="break-words whitespace-pre-wrap">
                    🚫 This message was deleted
                </p>
            );
        }
        if (message.fileUrl) {
            const src = message.fileUrl.startsWith('http') ? message.fileUrl : `${BASE_URL}${message.fileUrl}`;

            if (message.fileUrl.endsWith(".webm") || message.fileUrl.endsWith(".mp3") || message.fileUrl.endsWith(".wav")) {
                return (
                    <VoiceMessagePlayer
                        audioUrl={src}
                        isOwnMessage={isOwnMessage}
                    />
                );
            }

            const isImage = message.fileType === 'image';

            return (
                <div className={message.text ? "mb-2" : ""}>
                    {isImage ? (
                        <img
                            src={src}
                            alt="Attachment"
                            className="max-w-full rounded-lg object-cover max-h-[300px] cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(src, "_blank")}
                        />
                    ) : (
                        <video controls className="max-w-full rounded-lg max-h-[300px]">
                            <source src={src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {message.text && message.text !== "🎤 Voice Message" && (
                        <p className="break-words whitespace-pre-wrap mt-2">{message.text}</p>
                    )}
                </div>
            );
        }
        return <p className="break-words whitespace-pre-wrap">{message.text}</p>;
    };

    // Determine Tick Status
    const getTickIcon = () => {
        const readBy = message.readBy || [];
        const readCount = readBy.length;
        const totalMembers = Number(membersCount) || 0;

        // Log for debugging (will remove later)
        // console.log(`Msg: ${ message.text }, Read: ${ readCount }, Total: ${ totalMembers } `);

        if (readCount >= totalMembers && totalMembers > 0) {
            // Read by Everyone
            return <BsCheckAll className="text-sky-500 font-bold text-[18px]" title="Read by everyone" />;
        } else if (readCount > 1) {
            // Read by at least one other person
            return <BsCheckAll className="text-zinc-400 text-[18px]" title="Read by some" />;
        } else {
            // Sent but not read by others yet
            return <BsCheck className="text-zinc-400 text-[18px]" title="Sent" />;
        }
    };

    const ownBubbleClass = `
        ${theme === "light" ? "bg-sky-400 text-white" : "bg-sky-700 text-white"}
        rounded-lg rounded-tr-none shadow-sm
    `;

    const otherBubbleClass = `
        ${theme === "light" ? "bg-gray-200 text-black" : "bg-[#1f2937] text-white"}
        rounded-lg rounded-tl-none shadow-sm
    `;

    return (
        <div className={`group flex items-start gap-1 mb-1.5 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar for other users */}
            {!isOwnMessage && (
                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs overflow-hidden shrink-0 mt-1">
                    {message.sender?.avatar ? (
                        <img
                            src={message.sender.avatar.startsWith("http") ? message.sender.avatar : `${BASE_URL}${message.sender.avatar}`}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        message.sender?.username?.[0]?.toUpperCase()
                    )}
                </div>
            )}

            {/* MESSAGE BUBBLE */}
            <div
                className={`relative px-3 py-1.5 max-w-[85%] sm:max-w-[70%] text-[14px] leading-relaxed transition-all ${isOwnMessage ? ownBubbleClass : otherBubbleClass} ${message.isDeleted ? "italic opacity-60 font-light" : ""}`}
            >
                {/* Sender Name for other users */}
                {!isOwnMessage && (
                    <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 mb-0.5 opacity-90">
                        {message.sender?.username}
                    </p>
                )}

                {/* CONTENT */}
                <div className="relative pr-2">
                    {renderContent()}
                </div>

                {/* METADATA (TIME & STATUS) */}
                <div className="flex items-center justify-end gap-1.5 mt-0.5 select-none">
                    <span className="text-[10px] opacity-60 font-light">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        })}
                    </span>

                    {/* Show double tick for own messages */}
                    {isOwnMessage && !message.isDeleted && (
                        <div className="flex items-center -mr-1">
                            {getTickIcon()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupMessageItem;
