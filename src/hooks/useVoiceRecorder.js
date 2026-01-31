import { useState, useRef, useCallback } from 'react';

const useVoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const isCancelledRef = useRef(false);
    const isStartingRef = useRef(false);
    const shouldStopRef = useRef(false);

    const startRecording = useCallback(async () => {
        if (isRecording || isStartingRef.current) return;

        isStartingRef.current = true;
        shouldStopRef.current = false;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Check if user released while we were getting permission/stream
            if (shouldStopRef.current) {
                stream.getTracks().forEach(track => track.stop());
                isStartingRef.current = false;
                return;
            }

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            isCancelledRef.current = false;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                if (isCancelledRef.current) {
                    setIsProcessing(false);
                    return;
                }

                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioBlob(audioBlob);
                setAudioURL(url);
                setIsProcessing(false);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            setAudioBlob(null);

            isStartingRef.current = false;

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            isStartingRef.current = false;
            // alert('Could not access microphone. Please check permissions.');
        }
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        // If starting, mark to stop immediately upon start
        if (isStartingRef.current) {
            shouldStopRef.current = true;
            return;
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            setIsProcessing(true);
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, []);

    const cancelRecording = useCallback(() => {
        isCancelledRef.current = true;
        shouldStopRef.current = true; // Ensure pending start is also confused

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            // Tracks stopped in onstop usually, but double check
        }

        // Reset state immediately for UI responsiveness
        setIsRecording(false);
        setIsProcessing(false);
        setRecordingTime(0);
        setAudioBlob(null);
        setAudioURL(null);
        audioChunksRef.current = [];

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, []);

    const resetRecording = useCallback(() => {
        setRecordingTime(0);
        setAudioBlob(null);
        setAudioURL(null);
        audioChunksRef.current = [];
        setIsProcessing(false);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        isRecording,
        isProcessing,
        recordingTime,
        audioBlob,
        audioURL,
        startRecording,
        stopRecording,
        cancelRecording,
        resetRecording,
        formattedTime: formatTime(recordingTime)
    };
};

export default useVoiceRecorder;
