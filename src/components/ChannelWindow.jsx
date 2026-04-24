import React, { useEffect, useState } from "react";
import { FiSearch, FiMoreVertical, FiSend, FiImage, FiArrowLeft } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { getChannelUpdates, postChannelUpdate } from "../services/channel.services";
import useTheme from "../hooks/useTheme";
import { BASE_URL } from "../config";

const ChannelWindow = ({ channel, onBack }) => {
    const { theme } = useTheme();
    const [updates, setUpdates] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const auth = JSON.parse(localStorage.getItem("auth"));
    const currentUser = auth?.user;
    const isOwner = channel?.owner?._id === currentUser?._id || channel?.owner === currentUser?._id;

    useEffect(() => {
        if (!channel) return;
        const fetchUpdates = async () => {
            setLoading(true);
            try {
                const data = await getChannelUpdates(channel._id);
                setUpdates(data);
            } catch (err) {
                console.error("Failed to fetch channel updates:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUpdates();
    }, [channel]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSendUpdate = async (e) => {
        e.preventDefault();
        if (!text.trim() && !selectedFile) return;
        if (sending) return;

        setSending(true);
        try {
            const formData = new FormData();
            if (text.trim()) formData.append("text", text);
            if (selectedFile) formData.append("updateFile", selectedFile);

            const newUpdate = await postChannelUpdate(channel._id, formData);
            setUpdates([...updates, { ...newUpdate, sender: currentUser }]);

            // Success cleanup
            setText("");
            setSelectedFile(null);
            setPreviewUrl("");
        } catch (err) {
            console.error("Failed to post update:", err);
            alert("Failed to post update.");
        } finally {
            setSending(false);
        }
    };

    if (!channel) {
        return (
            <div className={`flex flex-col items-center justify-center flex-1 h-full ${theme === "dark" ? "bg-[#0b141a]" : "bg-white"}`}>
                <p className="text-zinc-500 font-medium">Select a channel to view updates</p>
            </div>
        );
    }

    // BASE URL

    return (
        <div className="flex flex-col flex-1 min-w-0 h-full bg-[#fdf7f0] dark:bg-[#0b141a]">
            {/* HEADER */}
            <div className="h-16 px-4 flex items-center justify-between border-b dark:border-zinc-700 bg-white dark:bg-[#0b1220] shrink-0">
                <div className="flex items-center gap-2">
                    {/* Back Button for Mobile */}
                    <button
                        onClick={onBack}
                        className="md:hidden p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <FiArrowLeft className="text-xl text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-lg border dark:border-sky-500/20 shadow-sm overflow-hidden">
                        {channel.avatar ? <img src={channel.avatar.startsWith("http") ? channel.avatar : `${BASE_URL}${channel.avatar}`} alt="" className="w-full h-full object-cover" /> : channel.name[0]}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{channel.name}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{channel.followers?.length || 0} followers</p>
                    </div>
                </div>
                </div>

                <div className="flex items-center gap-5 text-xl text-gray-600 dark:text-gray-300">
                    <FiSearch className="cursor-pointer hover:text-sky-500 transition-colors" />
                    <FiMoreVertical className="cursor-pointer hover:text-sky-500 transition-colors" />
                </div>
            </div>

            {/* FEED CONTENT */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6 no-scrollbar">
                {loading ? (
                    <div className="text-center text-zinc-500 animate-pulse py-10">Loading updates...</div>
                ) : updates.length === 0 ? (
                    <div className="text-center text-zinc-400 py-20 italic">No updates in this channel yet.</div>
                ) : (
                    updates.map((msg) => (
                        <div key={msg._id} className="max-w-[85%] mx-auto bg-white dark:bg-[#1f2c33] rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-none animate-in slide-in-from-bottom-4 duration-300">
                            {msg.mediaUrl && (
                                <div className="mb-4 rounded-xl overflow-hidden ring-1 ring-zinc-100 dark:ring-zinc-700">
                                    {msg.mediaType === "video" ? (
                                        <video src={`${BASE_URL}${msg.mediaUrl}`} controls className="w-full max-h-96 object-contain" />
                                    ) : (
                                        <img
                                            src={msg.mediaUrl.startsWith("http") ? msg.mediaUrl : `${BASE_URL}${msg.mediaUrl}`}
                                            className="w-full h-auto max-h-96 object-contain"
                                            alt="Update"
                                        />
                                    )}
                                </div>
                            )}
                            {msg.text && (
                                <p className="text-[15px] text-gray-800 dark:text-zinc-200 leading-relaxed">
                                    {msg.text}
                                </p>
                            )}
                            <div className="flex justify-end mt-2">
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER */}
            <div className="px-4 py-3 border-t dark:border-zinc-700 bg-white dark:bg-[#0b1220] shrink-0">
                {isOwner ? (
                    <div className="flex flex-col gap-2">
                        {previewUrl && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border dark:border-zinc-700 bg-black/5">
                                {selectedFile.type.startsWith("video") ? (
                                    <video src={previewUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                )}
                                <button
                                    onClick={() => { setSelectedFile(null); setPreviewUrl(""); }}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <IoClose size={12} />
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSendUpdate} className="flex gap-2 items-center">
                            <label className="p-2 sm:p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer shrink-0">
                                <FiImage size={24} />
                                <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                            </label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Post an update..."
                                className="flex-1 min-w-0 bg-zinc-50 dark:bg-zinc-900/50 border dark:border-zinc-700 rounded-xl px-3 sm:px-4 py-2.5 outline-none focus:ring-1 focus:ring-sky-500 dark:text-white text-xs sm:text-sm"
                            />
                            <button
                                type="submit"
                                disabled={(!text.trim() && !selectedFile) || sending}
                                className={`p-3 rounded-xl transition-all shadow-lg shrink-0 ${(!text.trim() && !selectedFile) || sending ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400" : "bg-sky-500 text-white shadow-sky-500/20"
                                    }`}
                            >
                                <FiSend />
                            </button>
                        </form>
                    </div>
                ) : (
                    <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 tracking-wider uppercase text-center py-2">
                        This channel is read-only
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChannelWindow;
