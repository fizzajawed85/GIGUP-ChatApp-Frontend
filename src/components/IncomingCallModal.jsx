import React, { useContext } from 'react';
import { CallingContext } from '../context/CallingContext';
import { FiPhone, FiX, FiVideo } from 'react-icons/fi';

const IncomingCallModal = () => {
    const { call, answerCall, declineCall, callAccepted, joinGroupCall } = useContext(CallingContext);

    if (!call.isReceivedCall || callAccepted) return null;

    const isGroup = call.isGroup;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1f2c33] w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border dark:border-white/10 p-8 flex flex-col items-center text-center animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-sky-500/10 flex items-center justify-center animate-pulse">
                        <div className="w-20 h-20 rounded-full bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                            {call.type === 'video' ? <FiVideo className="text-4xl text-white" /> : <FiPhone className="text-4xl text-white" />}
                        </div>
                    </div>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest animate-bounce">
                        {isGroup ? 'Group Call' : 'Incoming'}
                    </span>
                </div>

                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1 line-clamp-1">
                    {call.name || 'GIGUP User'}
                </h2>
                <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-8">
                    {isGroup
                        ? `${call.callerName} is inviting you...`
                        : `Is requesting a ${call.type} call`
                    }
                </p>

                <div className="flex items-center gap-6 w-full">
                    <button
                        onClick={declineCall}
                        className="flex-1 flex flex-col items-center gap-2 group"
                    >
                        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center transition-all group-hover:bg-red-500 group-hover:text-white group-hover:rotate-12 group-active:scale-90">
                            <FiX className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-red-500 transition-colors">Decline</span>
                    </button>

                    <button
                        onClick={isGroup ? joinGroupCall : answerCall}
                        className="flex-1 flex flex-col items-center gap-2 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30 transition-all group-hover:scale-110 group-hover:-rotate-12 group-active:scale-95 animate-bounce">
                            <FiPhone className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-green-500 transition-colors">Join</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
