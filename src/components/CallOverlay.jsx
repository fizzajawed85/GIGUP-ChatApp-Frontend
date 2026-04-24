import React, { useContext } from 'react';
import { CallingContext } from '../context/CallingContext';
import { FiPhoneOff, FiMic, FiVideo } from 'react-icons/fi';

const CallOverlay = () => {
    const {
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        leaveCall,
        isCalling
    } = useContext(CallingContext);

    if (!isCalling && !callAccepted) return null;

    return (
        <div className="fixed inset-0 z-[110] bg-[#0b141a] flex flex-col items-center justify-center p-4 md:p-8">
            {/* REMOTE VIDEO (Fullscreen) */}
            <div className="relative w-full h-full rounded-none md:rounded-3xl overflow-hidden bg-zinc-900 border-0 md:border dark:border-white/5 shadow-2xl">
                {callAccepted ? (
                    <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                        <div className="w-32 h-32 rounded-full bg-sky-500/20 flex items-center justify-center animate-pulse">
                            <div className="w-24 h-24 rounded-full bg-sky-500 flex items-center justify-center">
                                <span className="text-4xl font-black text-white uppercase">{call.name?.[0] || 'C'}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{call.name || 'GIGUP User'}</h2>
                            <p className="text-sky-400 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Establishing Link...</p>
                        </div>
                    </div>
                )}

                {/* LOCAL VIDEO (PIP) */}
                {stream && (
                    <div className="absolute top-4 right-4 w-24 md:w-48 aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-black border-2 border-white/20 shadow-xl">
                        <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover -scale-x-100" />
                    </div>
                )}

                {/* CONTROLS */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-6 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                    <button className="p-4 rounded-full bg-white/5 text-white hover:bg-white/20 transition-all">
                        <FiMic className="text-xl" />
                    </button>
                    <button
                        onClick={leaveCall}
                        className="p-5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:rotate-12 active:scale-90"
                    >
                        <FiPhoneOff className="text-2xl" />
                    </button>
                    <button className="p-4 rounded-full bg-white/5 text-white hover:bg-white/20 transition-all">
                        <FiVideo className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallOverlay;
