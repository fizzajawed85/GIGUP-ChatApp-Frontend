import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAIMessage, setSelectedConversation } from "../redux/slices/aiSlice";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import { FiSearch, FiMoreVertical, FiSend, FiImage, FiLoader, FiX, FiArrowLeft } from "react-icons/fi";
import { MdCall, MdVideocam, MdMic } from "react-icons/md";
import { RiRobot2Line } from "react-icons/ri";
import VoiceMessagePlayer from "./VoiceMessagePlayer";
import useVoiceRecorder from "../hooks/useVoiceRecorder";
import { BASE_URL } from "../config";

const AIChatWindow = () => {
    const dispatch = useDispatch();
    const { selectedConversation, messages, sending, error } = useSelector((state) => state.ai);
    const auth = JSON.parse(localStorage.getItem("auth"));
    const user = auth?.user;
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);

    const {
        isRecording,
        isProcessing,
        recordingTime,
        audioBlob,
        startRecording,
        stopRecording,
        cancelRecording,
        resetRecording,
        formattedTime
    } = useVoiceRecorder();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSend = () => {
        if ((!input.trim() && !selectedFile) || sending) return;
        dispatch(sendAIMessage({
            text: input,
            conversationId: selectedConversation?._id,
            file: selectedFile
        }));
        setInput("");
        clearFile();
    };

    const handleSendVoice = () => {
        if (!audioBlob || sending) return;
        // Wrap blob in a File object to ensure filename and clean mimetype for Multer/Gemini
        const voiceFile = new File([audioBlob], "voice_message.webm", { type: "audio/webm" });
        dispatch(sendAIMessage({
            text: "",
            conversationId: selectedConversation?._id,
            file: voiceFile
        }));
        resetRecording();
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0b1220]">
            {/* Header */}
            <div className="h-16 px-4 border-b dark:border-zinc-700 flex items-center justify-between bg-white dark:bg-[#0b1220] shrink-0">
                <div className="flex items-center gap-2">
                    {/* Back Button for Mobile */}
                    <button
                        onClick={() => dispatch(setSelectedConversation(null))}
                        className="md:hidden p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <FiArrowLeft className="text-xl text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-lg animate-pulse">
                                <RiRobot2Line className="text-2xl" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0b1220] rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white">Giga</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-zinc-500 dark:text-sky-400 uppercase tracking-widest font-bold">Pulse Core Active</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                    <FiSearch className="hover:text-sky-500 cursor-pointer transition-colors" />
                    <FiMoreVertical className="hover:text-sky-500 cursor-pointer transition-colors" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar bg-[url('/chat-bg.png')] dark:bg-[#0b141a] bg-white">
                {error && (
                    <div className="p-3 mb-2 bg-red-50 dark:bg-red-900/10 text-red-500 text-xs rounded-xl border border-red-100 dark:border-red-900/20 text-center animate-pulse">
                        Giga encountered a synapse error: {error}
                    </div>
                )}
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-6 opacity-60">
                        <div className="w-20 h-20 rounded-full bg-sky-100 dark:bg-sky-900/20 flex items-center justify-center text-sky-500 mb-2 shadow-inner">
                            <RiRobot2Line className="text-5xl opacity-80" />
                        </div>
                        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
                            Greetings, {user?.username || "Human"}!
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-sm font-medium">
                            I am Giga, your AI companion. How can I assist you in GIGUP today?
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative ${msg.role === 'user'
                                ? "bg-sky-500 text-white rounded-tr-none shadow-sky-200 dark:shadow-none"
                                : "bg-white dark:bg-[#1f2937] text-gray-900 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-700/50 rounded-tl-none shadow-zinc-100 dark:shadow-none"
                                }`}>
                                {/* Media Rendering */}
                                {msg.fileType === "audio" && msg.fileUrl ? (
                                    <div className={`mb-2 ${msg.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                        <VoiceMessagePlayer
                                            audioUrl={msg.fileUrl.startsWith("http") ? msg.fileUrl : `${BASE_URL}${msg.fileUrl}`}
                                            duration={0} // Duration fallback
                                            isOwnMessage={msg.role === 'user'}
                                        />
                                    </div>
                                ) : msg.fileUrl && (
                                    <div className="mb-2 rounded-lg overflow-hidden border border-black/5 dark:border-white/5 shadow-sm">
                                        {msg.fileType === "image" ? (
                                            <img
                                                src={msg.fileUrl.startsWith("http") ? msg.fileUrl : `${BASE_URL}${msg.fileUrl}`}
                                                alt="Attachment"
                                                className="max-w-full max-h-[250px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                                onClick={() => window.open(msg.fileUrl.startsWith("http") ? msg.fileUrl : `${BASE_URL}${msg.fileUrl}`, "_blank")}
                                            />
                                        ) : (
                                            <video controls className="max-w-full max-h-[250px] rounded-lg">
                                                <source src={msg.fileUrl.startsWith("http") ? msg.fileUrl : `${BASE_URL}${msg.fileUrl}`} type="video/mp4" />
                                            </video>
                                        )}
                                    </div>
                                )}

                                <p className="text-[14px] leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                                <div className={`text-[9px] mt-1 opacity-50 uppercase tracking-tighter font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.role === 'user' ? 'Transmit Complete' : 'Processor Node 01'}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {sending && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white dark:bg-[#1f2937] text-gray-400 rounded-2xl rounded-tl-none px-4 py-2 border dark:border-zinc-700/50 flex items-center gap-3 shadow-sm">
                            <FiLoader className="animate-spin text-sky-500" />
                            <span className="text-xs font-bold tracking-wide text-sky-500/80">Giga is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* PREVIEW AREA */}
            {previewUrl && (
                <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-t dark:border-zinc-700 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-12 h-12 rounded overflow-hidden bg-black/10 border dark:border-zinc-700">
                            {selectedFile?.type.startsWith("image") ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-sky-500">VIDEO</div>
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[11px] font-bold text-sky-500 uppercase tracking-wider">Giga Vision Active</span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">{selectedFile.name}</span>
                        </div>
                    </div>
                    <button
                        onClick={clearFile}
                        className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 transition-colors"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>
            )}

            {/* Input Area Overhaul */}
            <div className="h-16 px-4 flex items-center gap-3 border-t dark:border-zinc-700 bg-white dark:bg-[#0b1220] shrink-0">
                <div className="flex items-center gap-4 text-zinc-400 text-xl font-light">
                    <BsThreeDots className="hover:text-sky-500 cursor-pointer transition-colors" />
                    <BsEmojiSmile className="hover:text-sky-500 cursor-pointer transition-colors" />

                    {/* Gallery Option */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        hidden
                        accept="image/*,video/*"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="hover:text-sky-500 transition-colors"
                        title="Upload for Giga Vision"
                    >
                        <FiImage className="text-xl" />
                    </button>
                </div>

                <div className="flex-1 relative flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                        placeholder="Message Giga..."
                        className="flex-1 px-4 py-2 rounded-full bg-zinc-100 dark:bg-[#1f2937] outline-none text-sm text-gray-900 dark:text-white border-transparent focus:border-sky-500/50 border transition-all"
                    />
                </div>

                {/* Voice Recording UI */}
                <div
                    className="flex items-center select-none touch-none"
                    onMouseDown={!audioBlob && !isRecording && !isProcessing ? startRecording : undefined}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    onTouchStart={!audioBlob && !isRecording && !isProcessing ? startRecording : undefined}
                    onTouchEnd={stopRecording}
                >
                    {isRecording ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-mono text-red-600 dark:text-red-400 font-bold">{formattedTime}</span>
                            <span className="text-[10px] text-red-600 dark:text-red-400 opacity-70">Release to send</span>
                        </div>
                    ) : isProcessing ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full">
                            <div className="w-3 h-3 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                            <span className="text-xs text-zinc-500">Processing...</span>
                        </div>
                    ) : audioBlob ? (
                        <div className="flex items-center gap-2 px-2" onMouseDown={(e) => e.stopPropagation()}>
                            <button
                                onClick={resetRecording}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                                title="Discard"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                            <div className="px-3 py-1.5 text-xs text-sky-500 font-medium">
                                Voice ready
                            </div>
                        </div>
                    ) : (
                        <button
                            className="hover:text-sky-500 transition-colors p-2 active:scale-95 transform transition-transform cursor-pointer"
                            title="Hold to record voice message"
                        >
                            <MdMic className="text-2xl" />
                        </button>
                    )}
                </div>

                <button
                    onClick={audioBlob ? handleSendVoice : handleSend}
                    disabled={(!input.trim() && !selectedFile && !audioBlob) || sending || isProcessing}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                        bg-sky-400 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-600
                    `}
                    title={audioBlob ? "Send Voice" : "Send Message"}
                >
                    {sending ? <FiLoader className="animate-spin" /> : <FiSend />}
                </button>
            </div>
        </div>
    );
};

export default AIChatWindow;
