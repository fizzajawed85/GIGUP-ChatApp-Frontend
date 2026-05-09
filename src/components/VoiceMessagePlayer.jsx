import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';

const VoiceMessagePlayer = ({ audioUrl, duration, isOwnMessage }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(duration || 0);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        console.log(">>> VoiceMessagePlayer loading:", audioUrl);

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => {
            console.log(">>> Audio Duration Loaded:", audio.duration);
            if (audio.duration && audio.duration !== Infinity) {
                setAudioDuration(audio.duration);
            }
        };
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };
        const handleError = (e) => {
            console.error(">>> Audio Playback Error:", e.target.error);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [audioUrl]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        audio.currentTime = percentage * audioDuration;
    };

    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

    return (
        <div className={`flex items-center gap-2 min-w-[200px] ${isOwnMessage
            ? 'text-white'
            : 'text-gray-900 dark:text-white'
            }`}>
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOwnMessage
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-500'
                    }`}
            >
                {isPlaying ? <FiPause className="text-lg" /> : <FiPlay className="text-lg ml-0.5" />}
            </button>

            {/* Waveform / Progress */}
            <div className="flex-1 flex items-center gap-3 overflow-hidden h-10">
                <div
                    onClick={handleSeek}
                    className={`flex-1 h-1.5 rounded-full cursor-pointer overflow-hidden relative ${isOwnMessage ? 'bg-white/30' : 'bg-zinc-400/50 dark:bg-zinc-600'
                        }`}
                >
                    <div
                        className={`h-full transition-all duration-100 ${isOwnMessage ? 'bg-white' : 'bg-sky-500'
                            }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Open in New Tab Fallback */}
            <a
                href={audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors ${isOwnMessage ? 'hover:bg-white/20 text-white/70' : 'hover:bg-zinc-100 text-zinc-400'}`}
                title="Open in new tab"
                onClick={(e) => e.stopPropagation()}
            >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
        </div>
    );
};

export default VoiceMessagePlayer;
