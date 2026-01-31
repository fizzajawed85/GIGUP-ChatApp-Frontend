import React from "react";
import useTheme from "../hooks/useTheme";

const ChatListItem = ({ chat, isActive, onSelect }) => {
  const { theme } = useTheme();
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const authUserId = auth?.user?._id;

  const otherUser = chat.participants.find(
    (p) => p._id.toString() !== authUserId
  );

  const getUserId = (u) => u?._id ? u._id.toString() : u?.toString();

  const nicknameObj = chat.nicknames?.find(n => getUserId(n.user) === authUserId);
  const displayName = nicknameObj?.name || otherUser?.username;

  const myUnread = chat.unreadCounts?.find(uc => getUserId(uc.user) === authUserId);
  const myUnreadCount = myUnread?.count || 0;

  return (
    <div
      onClick={() => onSelect(chat)}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-all border-b dark:border-zinc-800
        ${isActive ? "bg-sky-50 dark:bg-sky-900/30 border-l-4 border-l-sky-500" : "hover:bg-gray-50 dark:hover:bg-zinc-800/50"}
      `}
    >
      <div className="relative shrink-0">
        <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white text-lg font-bold
          ${theme === "light" ? "bg-sky-400 shadow-sm" : "bg-zinc-700"}
        `}>
          {otherUser?.avatar ? (
            <img
              src={`http://localhost:5000${otherUser.avatar}`}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{displayName?.charAt(0)?.toUpperCase()}</span>
          )}
        </div>
        {otherUser?.isOnline && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="font-semibold text-sm truncate">
          {displayName}
        </p>
        <p className={`text-xs truncate ${myUnreadCount > 0
          ? "text-sky-500 font-extrabold"
          : "text-gray-600 dark:text-gray-400"
          }`}>
          {chat?.latestMessage?.text || "No messages yet"}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        {chat?.latestMessage?.createdAt && (
          <span className={`text-[10px] ${myUnreadCount > 0 ? "text-sky-500 font-bold" : "text-gray-500"}`}>
            {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}

        {myUnreadCount > 0 && (
          <div className="min-w-[18px] h-[18px] px-1 bg-sky-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            {myUnreadCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;
