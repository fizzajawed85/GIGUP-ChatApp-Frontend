import { BsCheck, BsCheckAll } from "react-icons/bs";
import useTheme from "../hooks/useTheme";

const MessageItem = ({ message, isOwnMessage }) => {
  const { theme } = useTheme();

  const ownBubbleClass = `
    ${theme === "light" ? "bg-sky-400" : "bg-sky-700"}
    text-white
    rounded-lg rounded-br-none
  `;

  const otherBubbleClass = `
    ${theme === "light" ? "bg-gray-200 text-black" : "bg-[#1f2937] text-white"}
    rounded-lg rounded-bl-none
  `;

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 max-w-[70%] text-sm ${
          isOwnMessage ? ownBubbleClass : otherBubbleClass
        }`}
      >
        <p className="break-words">{message.text}</p>

        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}

          {isOwnMessage &&
            (message.status === "seen" ? (
              <BsCheckAll className="text-white" />
            ) : (
              <BsCheck className="text-white" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

