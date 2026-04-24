import React, { useState } from "react";
import { IoClose, IoSend } from "react-icons/io5";
import { FaPalette, FaImage } from "react-icons/fa";
import { createStatus } from "../services/status.services";

const StatusCreator = ({ onCancel, onPosted }) => {
    const [type, setType] = useState("text");
    const [content, setContent] = useState("");
    const [bgColor, setBgColor] = useState("#0ea5e9");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const colors = ["#0ea5e9", "#ef4444", "#10b981", "#8b5cf6", "#f59e0b", "#6366f1", "#111827"];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setType(file.type.startsWith("video") ? "video" : "image");
    };

    const handlePost = async () => {
        if (type === "text" && !content.trim()) return;
        if (type !== "text" && !selectedFile) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("type", type);

            if (type === "text") {
                formData.append("content", content);
                formData.append("backgroundColor", bgColor);
            } else {
                formData.append("statusFile", selectedFile);
            }

            await createStatus(formData);
            onPosted();
        } catch (err) {
            console.error("Failed to post status:", err);
            alert("Failed to post status. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 dark:bg-[#0b141a] p-3 sm:p-6 animate-in slide-in-from-right duration-300">
            <div className="w-full max-w-xl bg-white dark:bg-[#1f2c33] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border dark:border-zinc-700/50">
                {/* HEADER */}
                <div className="px-6 py-4 border-b dark:border-zinc-700/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 italic">Create Update</h2>
                    <button onClick={onCancel} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <IoClose className="text-2xl text-zinc-500" />
                    </button>
                </div>

                {/* CONTENT AREA */}
                <div
                    className="aspect-video relative flex flex-col items-center justify-center transition-all duration-500 overflow-hidden"
                    style={{ backgroundColor: type === "text" ? bgColor : "#000" }}
                >
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Type an update..."
                            className="w-full h-full bg-transparent text-white text-xl sm:text-3xl font-bold text-center p-6 sm:p-12 outline-none placeholder:text-white/50 resize-none flex items-center justify-center leading-relaxed"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col relative group">
                            <div className="flex-1 flex items-center justify-center p-4">
                                {previewUrl ? (
                                    type === "video" ? (
                                        <video src={previewUrl} controls className="max-h-full rounded-xl shadow-lg border border-white/20" />
                                    ) : (
                                        <img src={previewUrl} alt="Preview" className="max-h-full rounded-xl shadow-lg border border-white/20 object-contain" />
                                    )
                                ) : (
                                    <div className="text-white/50 text-center">
                                        <FaImage className="text-6xl mx-auto mb-4 opacity-20" />
                                        <p className="text-sm">Select an image or video</p>
                                    </div>
                                )}
                            </div>

                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all opacity-0 group-hover:opacity-100">
                                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold border border-white/20">
                                    Change File
                                </span>
                                <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    )}
                </div>

                {/* TOOLBAR */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-2 justify-between items-center bg-white dark:bg-[#1f2c33]">
                    <div className="flex flex-wrap gap-2 items-center">
                        {type === "text" ? (
                            <>
                                <button
                                    onClick={() => setType("image")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-sky-500"
                                >
                                    <FaImage /> Photo / Video
                                </button>
                                <div className="flex gap-2 items-center">
                                    <FaPalette className="text-zinc-400 mr-1" />
                                    {colors.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setBgColor(c)}
                                            className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${bgColor === c ? "border-sky-500 scale-110 shadow-lg shadow-sky-500/30" : "border-white/50"}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => { setType("text"); setSelectedFile(null); setPreviewUrl(""); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-sky-500"
                            >
                                <FaPalette /> Text Update
                            </button>
                        )}
                    </div>

                    <button
                        disabled={(type === "text" ? !content.trim() : !selectedFile) || loading}
                        onClick={handlePost}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-xl ${((type === "text" ? !content.trim() : !selectedFile) || loading)
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                            : "bg-sky-500 text-white hover:bg-sky-600 active:scale-95 shadow-sky-500/30"
                            }`}
                    >
                        {loading ? "Posting..." : <><IoSend /> Post Update</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusCreator;
