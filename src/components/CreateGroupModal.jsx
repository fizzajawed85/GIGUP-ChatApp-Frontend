import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { createGroup } from "../services/group.services";
import { useSelector } from "react-redux";

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
    const { chats } = useSelector((state) => state.chat);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const auth = JSON.parse(localStorage.getItem("auth"));
    const currentUserId = auth?.user?._id;

    // Extract unique contacts from chats
    const contacts = chats
        .map((chat) => {
            const otherUser = chat.participants?.find(
                (p) => (p._id || p).toString() !== currentUserId
            );
            return otherUser;
        })
        .filter((user) => user && user._id);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const toggleMember = (userId) => {
        setSelectedMembers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || selectedMembers.length === 0) {
            alert("Please enter a group name and select at least one member");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            if (selectedFile) data.append("groupAvatar", selectedFile);

            // Send members as JSON string
            selectedMembers.forEach(memberId => {
                data.append("members", memberId);
            });

            await createGroup(data);
            onGroupCreated();
            onClose();
        } catch (err) {
            console.error("Failed to create group:", err);
            alert("Failed to create group.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-[#1f2c33] rounded-3xl shadow-2xl overflow-hidden border dark:border-zinc-700/50 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b dark:border-zinc-700/50 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 italic">Create Group</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <IoClose className="text-2xl text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                    <div className="flex flex-col items-center mb-2">
                        <label className="relative cursor-pointer group">
                            <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-all border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden">
                                {previewUrl ? (
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Avatar Preview" />
                                ) : (
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-wider">Avatar</p>
                                        <p className="text-[20px]">+</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="text-[11px] text-zinc-500 mt-2">Tap to upload group icon</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">Group Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Study Group"
                            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What is this group about?"
                            rows={3}
                            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 transition-all dark:text-white resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">
                            Select Members ({selectedMembers.length})
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-zinc-200 dark:border-zinc-700 rounded-xl p-2 space-y-1">
                            {contacts.length === 0 ? (
                                <p className="text-xs text-zinc-400 text-center py-4">No contacts available</p>
                            ) : (
                                contacts.map((contact) => (
                                    <label
                                        key={contact._id}
                                        className="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(contact._id)}
                                            onChange={() => toggleMember(contact._id)}
                                            className="w-4 h-4 text-sky-500 rounded focus:ring-2 focus:ring-sky-500"
                                        />
                                        <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-sm overflow-hidden shrink-0">
                                            {contact.avatar ? (
                                                <img
                                                    src={contact.avatar.startsWith("http") ? contact.avatar : `http://localhost:5000${contact.avatar}`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                contact.username?.[0]?.toUpperCase()
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-900 dark:text-white">{contact.username}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.name.trim() || selectedMembers.length === 0}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl ${loading || !formData.name.trim() || selectedMembers.length === 0
                                ? "bg-zinc-300 dark:bg-zinc-800 cursor-not-allowed"
                                : "bg-sky-500 hover:bg-sky-600 active:scale-95 shadow-sky-500/30"
                            }`}
                    >
                        {loading ? "Creating..." : "Create Group"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
