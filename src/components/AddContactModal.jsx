import { useState } from "react";
import { createChat } from "../services/chat.services";

const AddContactModal = ({ onClose, onChatCreated }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      await createChat(email);
      onChatCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "User not found");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[520px] max-w-[95%] bg-white dark:bg-[#111827] rounded-3xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-[#1982c4] dark:bg-[#1982c4] p-4">
          <h2 className="text-xl font-bold text-white">Create Contact</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl bg-gray-100 dark:bg-[#1f2937]
                focus:outline-none focus:ring-2 focus:ring-sky-400
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl bg-gray-100 dark:bg-[#1f2937]
                focus:outline-none focus:ring-2 focus:ring-sky-400
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Invitation Message */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Invitation Message
            </label>
            <textarea
              placeholder="Enter Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl bg-gray-100 dark:bg-[#1f2937]
                focus:outline-none focus:ring-2 focus:ring-sky-400
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white"
            >
              Close
            </button>
            <button
              onClick={handleInvite}
              className="px-6 py-2 rounded-xl bg-[#1982c4] hover:bg-sky-500 text-white"
            >
              Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
