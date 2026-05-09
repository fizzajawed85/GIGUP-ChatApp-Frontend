import React, { useContext, useEffect, useRef } from 'react';
import { CallingContext } from '../context/CallingContext';
import {
    FiMic,
    FiMicOff,
    FiVideo,
    FiVideoOff,
    FiPhoneOff,
    FiMaximize,
    FiUsers
} from 'react-icons/fi';
import { BsGrid3X3GapFill } from 'react-icons/bs';

const GroupCallOverlay = () => {
    const {
        call,
        callAccepted,
        isCalling,
        leaveCall,
        myVideo,
        groupPeers,
        isGroupCall
    } = useContext(CallingContext);

    if (!isGroupCall || (!isCalling && !callAccepted)) return null;

    // Helper to render remote videos
    const RemoteVideo = ({ stream, peerId }) => {
        const videoRef = useRef();
        useEffect(() => {
            if (videoRef.current && stream) videoRef.current.srcObject = stream;
        }, [stream]);

        return (
            <div className="relative h-full w-full bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
                <video
                    playsInline
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">User ID: {peerId.slice(-4)}</span>
                </div>
            </div>
        );
    };

    // Calculate grid columns based on participant count
    const totalParticipants = groupPeers.length + 1; // +1 for self
    const gridCols = totalParticipants === 1 ? 'grid-cols-1' :
        totalParticipants === 2 ? 'grid-cols-1 md:grid-cols-2' :
            totalParticipants <= 4 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3';

    return (
        <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
            {/* CALL INFO HEADER */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-500">
                        <FiUsers className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">{call.name || "Group Call"}</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                {totalParticipants} Active Signal{totalParticipants > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <BsGrid3X3GapFill className="text-zinc-500" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mesh Matrix Active</span>
                </div>
            </div>

            {/* VIDEO GRID */}
            <div className={`w-full max-w-6xl aspect-video grid ${gridCols} gap-4 overflow-hidden py-24`}>
                {/* SELF VIDEO */}
                <div className="relative h-full w-full bg-zinc-900 rounded-3xl overflow-hidden border border-sky-500/30 shadow-2xl shadow-sky-500/10">
                    <video
                        playsInline
                        muted
                        ref={myVideo}
                        autoPlay
                        className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-500/30 flex items-center gap-2 text-sky-400">
                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">System (You)</span>
                    </div>
                    {!callAccepted && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center mb-4 animate-bounce">
                                <FiUsers className="text-2xl text-sky-500" />
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Establishing Uplink</h3>
                            <p className="text-xs text-zinc-400 mt-2 max-w-[200px]">Waiting for other participants to join the encrypted matrix...</p>
                        </div>
                    )}
                </div>

                {/* REMOTE VIDEOS */}
                {groupPeers.map((peerData) => (
                    <RemoteVideo
                        key={peerData.peerId}
                        stream={peerData.stream}
                        peerId={peerData.peerId}
                    />
                ))}
            </div>

            {/* CALL CONTROLS */}
            <div className="absolute bottom-12 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-3xl px-8 py-5 rounded-[40px] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all">
                    <FiMic className="text-xl" />
                </button>
                <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all">
                    <FiVideo className="text-xl" />
                </button>
                <button
                    onClick={leaveCall}
                    className="w-16 h-16 flex items-center justify-center rounded-3xl bg-red-500 hover:bg-red-600 text-white shadow-2xl shadow-red-500/40 hover:scale-105 active:scale-95 transition-all mx-4"
                >
                    <FiPhoneOff className="text-2xl" />
                </button>
                <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all">
                    <BsGrid3X3GapFill className="text-xl" />
                </button>
                <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all">
                    <FiMaximize className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default GroupCallOverlay;
