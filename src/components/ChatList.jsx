import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats, setSelectedChat } from "../redux/slices/chatSlice";
import { fetchMessages } from "../redux/slices/messageSlice";
import ChatListItem from "./ChatListItem";
import AddContactModal from "./AddContactModal";
import { FaPlus, FaSearch } from "react-icons/fa";

const ChatList = () => {
  const dispatch = useDispatch();
  const { chats, selectedChat, loading } = useSelector((state) => state.chat);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const selectChat = (chat) => {
    dispatch(setSelectedChat(chat));
    dispatch(fetchMessages(chat._id));
  };

  const filteredChats = chats.filter((chat) => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const authUserId = auth?.user?._id;

    const getUserId = (u) => u?._id ? u._id.toString() : u?.toString();

    const otherUser = chat.participants?.find(
      (p) => getUserId(p) !== authUserId
    );

    return otherUser?.username?.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <div className="p-4">Loading chats...</div>;

  return (
    <div className="w-[350px] h-full flex flex-col border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0b1220]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-zinc-700 shrink-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 italic">Chats</h2>
        <button
          onClick={() => setShowModal(true)}
          className="p-2 rounded-full border border-blue-300 dark:border-zinc-600 transition hover:bg-[#1982c4] hover:text-white dark:hover:bg-[#1982c4] group"
        >
          <FaPlus className="text-gray-900 dark:text-white group-hover:text-white" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 shrink-0">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
            <FaSearch />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Here.."
            className="w-full border rounded-md pl-10 pr-3 py-2 bg-[#f3f4f6] dark:bg-[#1f2937] text-black dark:text-white border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#1982c4] transition"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 mt-10">
            No chats found
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              isActive={chat._id === selectedChat?._id}
              onSelect={selectChat}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddContactModal
          onClose={() => setShowModal(false)}
          onChatCreated={() => dispatch(fetchChats())}
        />
      )}
    </div>
  );
};

export default ChatList;
