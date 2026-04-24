import { useState } from "react";
import { createChat } from "../services/chat.services";
import toast from "react-hot-toast";

const AddContactModal = ({ onClose, onChatCreated }) => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      await createChat(email, nickname);
      toast.success("Contact added successfully!");
      onChatCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="w-full sm:max-w-lg bg-white dark:bg-[#111827] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">

        {/* Mobile Handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-black text-sky-500 uppercase tracking-tighter">Create Contact</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 sm:hidden">
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Search Query */}
          <div>
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
              Identity Identifier
            </label>
            <input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#1f2937]
                border border-zinc-100 dark:border-zinc-800
                focus:outline-none focus:ring-2 focus:ring-sky-500/50
                placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium dark:text-white transition-all"
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
              Internal Nickname (Optional)
            </label>
            <input
              type="text"
              placeholder="Display Name"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full mt-1.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#1f2937]
                border border-zinc-100 dark:border-zinc-800
                focus:outline-none focus:ring-2 focus:ring-sky-500/50
                placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium dark:text-white transition-all"
            />
          </div>

          {/* Invitation Message */}
          <div>
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
              Initialization Message
            </label>
            <textarea
              placeholder="Brief introduction..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#1f2937]
                border border-zinc-100 dark:border-zinc-800
                focus:outline-none focus:ring-2 focus:ring-sky-500/50
                placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium dark:text-white transition-all
                resize-none"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 pb-6 sm:pb-0">
            <button
              onClick={onClose}
              className="order-2 sm:order-1 px-8 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              className="order-1 sm:order-2 px-8 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
            >
              Establish Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
