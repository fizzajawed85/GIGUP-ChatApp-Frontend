import React from "react";

const ChatListItem = ({ chat, isActive, onSelect }) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const authUserId = auth?.user?._id;

  console.log("AUTH USER:", authUserId);

  chat.participants.forEach((p) => {
    console.log("PARTICIPANT:", p._id.toString(), p.username);
  });

  const otherUser = chat.participants.find(
    (p) => p._id.toString() !== authUserId
  );

  return (
    <div
      onClick={() => onSelect(chat)}
      className={`
        flex items-center gap-3 px-4 py-3 cursor-pointer transition
        hover:bg-gray-200 dark:hover:bg-zinc-700
        ${isActive ? "bg-gray-300 dark:bg-zinc-700" : ""}
      `}
    >
      <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold">
        {otherUser?.username?.charAt(0)?.toUpperCase()}
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="font-semibold text-sm truncate">
          {otherUser?.username}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
          {chat?.latestMessage?.text || "No messages yet"}
        </p>
      </div>

      {chat?.latestMessage?.createdAt && (
        <span className="text-xs text-gray-500">
          {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );
};

export default ChatListItem;
