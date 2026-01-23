import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats, setSelectedChat } from "../redux/slices/chatSlice";
import { fetchMessages } from "../redux/slices/messageSlice";
import ChatListItem from "./ChatListItem";
import AddContactModal from "./AddContactModal";
import { FaPlus, FaSearch } from "react-icons/fa";

const ChatList = () => {
  const dispatch = useDispatch();
  const { chats, loading } = useSelector((state) => state.chat);

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
    const auth = JSON.parse(localStorage.getItem("auth"));
    const authUserId = auth?.user?._id;

   const otherUser = chat.participants.find(
  (p) => p._id.toString() !== authUserId
);


    return otherUser?.username?.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <div className="p-4">Loading chats...</div>;

  return (
    <div className="w-72 border-r dark:border-zinc-700 bg-white dark:bg-[#0b1220]">
      
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-zinc-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chats</h2>
        <button
          onClick={() => setShowModal(true)}
          className="p-2 rounded-full border border-blue-300 dark:border-zinc-600 transition hover:bg-[#1982c4] dark:hover:bg-[#1982c4]"
        >
          <FaPlus className="text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-300">
            <FaSearch />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Here.."
            className="w-full border rounded-md pl-10 pr-3 py-2 bg-white dark:bg-[#1f2937] text-black dark:text-white border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#1982c4] transition"
          />
        </div>
      </div>

      {/* List */}
      <div>
        {filteredChats.length === 0 ? (
          <div className="p-4 text-gray-600 dark:text-gray-400">
            No chats found
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
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
