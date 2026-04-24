import { useState } from "react";
import { BsCheck, BsCheckAll, BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit, FaTrash } from "react-icons/fa";
import VoiceMessagePlayer from "./VoiceMessagePlayer";
import useTheme from "../hooks/useTheme";
import { deleteMessage, editMessage } from "../services/chat.services";
import { useDispatch } from "react-redux";
import { updateMessage } from "../redux/slices/messageSlice";
import { socket } from "../utils/socket";
import { BASE_URL } from "../config";

const MessageItem = ({ message, isOwnMessage, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

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

      {/* MESSAGE BUBBLE */}
      <div
        className={`relative px-3 py-1.5 max-w-[85%] sm:max-w-[70%] text-[14px] leading-relaxed ${isOwnMessage ? ownBubbleClass : otherBubbleClass
          } ${message.isDeleted ? "italic opacity-60 font-light" : ""}`}
      >
        {/* CONTENT */}
        <div className="relative pr-2">
          {message.fileUrl && (
            <div className={message.text ? "mb-2" : ""}>
              {message.fileUrl.endsWith(".webm") || message.fileUrl.endsWith(".mp3") || message.fileUrl.endsWith(".wav") ? (
                <VoiceMessagePlayer
                  audioUrl={message.fileUrl.startsWith("http") ? message.fileUrl : `${BASE_URL}${message.fileUrl}`}
                  isOwnMessage={isOwnMessage}
                />
              ) : message.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                   src={message.fileUrl.startsWith("http") ? message.fileUrl : `${BASE_URL}${message.fileUrl}`}
                  alt="Attachment"
                  className="max-w-full rounded-lg object-cover max-h-[300px] cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.fileUrl.startsWith("http") ? message.fileUrl : `${BASE_URL}${message.fileUrl}`, "_blank")}
                />
              ) : (
                <video controls className="max-w-full rounded-lg max-h-[300px]">
                  <source src={message.fileUrl.startsWith("http") ? message.fileUrl : `${BASE_URL}${message.fileUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          {
            message.text && message.text !== "🎤 Voice Message" && (
              <p className="break-words whitespace-pre-wrap">
                {message.isDeleted ? "🚫 This message was deleted" : message.text}
              </p>
            )
          }
          {
            message.isEdited && !message.isDeleted && (
              <span className="text-[10px] opacity-40 float-right ml-2 mt-1">(edited)</span>
            )
          }
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

          {
            isOwnMessage && !message.isDeleted && (
              <div className="flex items-center -mr-1">
                {message.status === "sent" ? (
                  <BsCheck className="text-zinc-300 text-[18px]" />
                ) : (
                  <BsCheckAll className={`${message.status === "seen" ? "text-cyan-400" : "text-zinc-300"} text-[18px]`} />
                )}
              </div>
            )
          }
        </div>
      </div>

      {/* OPTIONS MENU (3 DOTS) - OPENS UPWARDS */}
      {
        isOwnMessage && !message.isDeleted && (
          <div className="relative self-center">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-opacity ${showMenu ? "opacity-100 bg-zinc-100 dark:bg-zinc-800" : "opacity-0 group-hover:opacity-100"
                } focus:opacity-100 active:bg-zinc-200 dark:active:bg-zinc-700`}
            >
              <BsThreeDotsVertical className="text-zinc-500 dark:text-zinc-400 text-sm" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute bottom-full right-0 mb-2 w-40 bg-white dark:bg-[#233138] rounded-md shadow-xl border dark:border-zinc-700/50 py-1 z-20 transition-all duration-200 origin-bottom-right">
                  <button
                    onClick={() => {
                      onEdit(message);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 transition-colors"
                  >
                    <FaEdit className="text-zinc-400 text-xs" /> Edit
                  </button>
                  <div className="h-[1px] bg-zinc-100 dark:bg-zinc-700/50 mx-2 my-1"></div>
                  <button
                    onClick={() => {
                      onDelete(message);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors font-medium"
                  >
                    <FaTrash className="text-red-400/80 text-xs" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )
      }
    </div>
  );
};

export default MessageItem;

