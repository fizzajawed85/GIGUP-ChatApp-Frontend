import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { createChannel } from "../services/channel.services";

const ChannelCreator = ({ isOpen, onClose, onCreated }) => {
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setLoading(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            if (selectedFile) data.append("channelAvatar", selectedFile);

            await createChannel(data);
            onCreated();
            onClose();
            setFormData({ name: "", description: "", avatar: "" });
            setSelectedFile(null);
            setPreviewUrl("");
        } catch (err) {
            console.error("Failed to create channel:", err);
            alert("Failed to create channel.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-[#1f2c33] rounded-3xl shadow-2xl overflow-hidden border dark:border-zinc-700/50 animate-in zoom-in-95 duration-300">
                <div className="px-6 py-4 border-b dark:border-zinc-700/50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 italic">Create Channel</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <IoClose className="text-2xl text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                        <p className="text-[11px] text-zinc-500 mt-2">Tap to upload channel icon</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">Channel Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. JS Knowledge Base"
                            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What is this channel about?"
                            rows={3}
                            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 transition-all dark:text-white resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.name.trim()}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl ${loading || !formData.name.trim()
                            ? "bg-zinc-300 dark:bg-zinc-800 cursor-not-allowed"
                            : "bg-sky-500 hover:bg-sky-600 active:scale-95 shadow-sky-500/30"
                            }`}
                    >
                        {loading ? "Creating..." : "Create Channel"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChannelCreator;
