import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { socket } from '../utils/socket';
import Peer from 'simple-peer';
import { createCallLog } from '../services/callService';

const CallingContext = createContext();

export const CallingProvider = ({ children }) => {
    // Shared State
    const [stream, setStream] = useState(null);
    const [call, setCall] = useState({});
    const [isCalling, setIsCalling] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    // 1-on-1 Specific Refs
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    // Group Call Specific State
    const [isGroupCall, setIsGroupCall] = useState(false);
    const [groupPeers, setGroupPeers] = useState([]); // Array of { peerId, peer, stream }
    const groupPeersRef = useRef([]); // Ref to keep track of peers for socket events

    const auth = JSON.parse(localStorage.getItem('auth'));
    const currentUserId = auth?.user?._id;

    // --- SOCKET HANDLERS ---
    useEffect(() => {
        // 1-on-1 Handlers
        socket.on('incomingCall', ({ from, callerName, signal, type }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal, type, isGroup: false });
        });

        socket.on('callEnded', () => {
            leaveCall();
        });

        socket.on('callDeclined', () => {
            alert("Call declined");
            leaveCall();
        });

        // Group Call Handlers
        socket.on('incomingGroupCall', ({ groupId, groupName, callerName, type }) => {
            setCall({
                isReceivedCall: true,
                groupId,
                name: groupName,
                callerName,
                type,
                isGroup: true
            });
        });

        socket.on('userJoinedGroupCall', ({ userId, username, socketId }) => {
            console.log(`[GroupCall] User ${username} joined. Initiating peer connection...`);
            // Only the existing members receive this. They initiate connection to the new guy.
            if (stream) {
                const peer = createPeer(userId, socket.id, stream);
                groupPeersRef.current.push({
                    peerId: userId,
                    peer,
                });
            }
        });

        socket.on('groupSignalRelay', ({ from, signal }) => {
            console.log(`[GroupCall] Received signal from ${from}`);
            const item = groupPeersRef.current.find(p => p.peerId === from);
            if (item) {
                item.peer.signal(signal);
            } else {
                // If peer doesn't exist, this means we are the "joiner" 
                // and an existing member is signaling US.
                const peer = addPeer(signal, from, stream);
                groupPeersRef.current.push({
                    peerId: from,
                    peer,
                });
            }
        });

        socket.on('userLeftGroupCall', ({ userId }) => {
            console.log(`[GroupCall] User ${userId} left.`);
            const item = groupPeersRef.current.find(p => p.peerId === userId);
            if (item) {
                item.peer.destroy();
            }
            const remaining = groupPeersRef.current.filter(p => p.peerId !== userId);
            groupPeersRef.current = remaining;
            setGroupPeers([...remaining]);
        });

        socket.on('groupCallEnded', () => {
            leaveCall();
        });

        return () => {
            socket.off('incomingCall');
            socket.off('callEnded');
            socket.off('callDeclined');
            socket.off('incomingGroupCall');
            socket.off('userJoinedGroupCall');
            socket.off('groupSignalRelay');
            socket.off('userLeftGroupCall');
            socket.off('groupCallEnded');
        };
    }, [stream]);

    // --- PEER HELPERS ---
    const createPeer = (userToSignal, callerId, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("groupSignal", { to: userToSignal, from: currentUserId, signal });
        });

        peer.on("stream", (remoteStream) => {
            updateGroupPeers(userToSignal, remoteStream);
        });

        return peer;
    };

    const addPeer = (incomingSignal, callerId, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("groupSignal", { to: callerId, from: currentUserId, signal });
        });

        peer.on("stream", (remoteStream) => {
            updateGroupPeers(callerId, remoteStream);
        });

        peer.signal(incomingSignal);
        return peer;
    };

    const updateGroupPeers = (userId, remoteStream) => {
        setGroupPeers(prev => {
            const exists = prev.find(p => p.peerId === userId);
            if (exists) return prev;
            return [...prev, { peerId: userId, stream: remoteStream }];
        });
    };

    const startTimeRef = useRef(null);
    const activeCallRef = useRef(null);

    // --- ACTIONS ---
    const getMedia = async (type) => {
        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({
                video: type === 'video',
                audio: true
            });
            setStream(currentStream);
            if (myVideo.current) myVideo.current.srcObject = currentStream;
            return currentStream;
        } catch (err) {
            console.error("Media access failed:", err);
            alert("Could not access camera/microphone.");
            return null;
        }
    };

    const startGroupCall = async (groupId, groupName, type) => {
        setIsGroupCall(true);
        setIsCalling(true);
        setCall({ groupId, name: groupName, type, isGroup: true });

        const mediaStream = await getMedia(type);
        if (mediaStream) {
            socket.emit("startGroupCall", {
                groupId,
                groupName,
                callerId: currentUserId,
                callerName: auth.user.username,
                type
            });
        }
    };

    const joinGroupCall = async () => {
        setIsGroupCall(true);
        setCallAccepted(true);

        const mediaStream = await getMedia(call.type);
        if (mediaStream) {
            socket.emit("joinGroupCall", {
                groupId: call.groupId,
                userId: currentUserId,
                username: auth.user.username
            });
        }
    };

    const callUser = async (id, type, targetName) => {
        setIsCalling(true);
        setCall({ isReceivedCall: false, from: id, name: targetName, type, isGroup: false });

        // Track for logging
        activeCallRef.current = {
            receiverId: id,
            type: type,
            status: 'missed', // default
            startTime: null
        };

        const mediaStream = await getMedia(type);

        const peer = new Peer({ initiator: true, trickle: false, stream: mediaStream });
        peer.on('signal', (data) => {
            socket.emit('callUser', {
                userToCall: id,
                signalData: data,
                from: currentUserId,
                callerName: auth.user.username,
                type
            });
        });

        peer.on('stream', (remoteStream) => {
            if (userVideo.current) userVideo.current.srcObject = remoteStream;
        });

        // Ensure clean state for listeners
        socket.off('callAccepted');
        socket.off('callDeclined');

        socket.on('callAccepted', (signal) => {
            console.log(">>> Call Accepted by receiver");
            setCallAccepted(true);
            peer.signal(signal);

            // Mark as answered and start timer
            if (activeCallRef.current) {
                activeCallRef.current.status = 'answered';
                startTimeRef.current = Date.now();
            }
        });

        socket.on('callDeclined', () => {
            console.log(">>> Call Declined by receiver");
            if (activeCallRef.current) {
                activeCallRef.current.status = 'declined';
                // Trigger log immediately for decline
                saveCallLog();
            }
            leaveCall();
        });

        connectionRef.current = peer;
    };

    const answerCall = async () => {
        setCallAccepted(true);
        const mediaStream = await getMedia(call.type);
        if (!mediaStream) return;

        const peer = new Peer({ initiator: false, trickle: false, stream: mediaStream });
        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from });
        });

        peer.on('stream', (remoteStream) => {
            if (userVideo.current) userVideo.current.srcObject = remoteStream;
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
    };

    const saveCallLog = async () => {
        if (!activeCallRef.current) return;

        const { receiverId, type, status } = activeCallRef.current;
        let duration = 0;
        if (startTimeRef.current && status === 'answered') {
            duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        }

        try {
            console.log(">>> Saving Call Log:", { receiverId, type, status, duration });
            await createCallLog({ receiverId, type, status, duration });
        } catch (err) {
            console.error(">>> Failed to save call log:", err);
        } finally {
            activeCallRef.current = null;
            startTimeRef.current = null;
        }
    };

    const leaveCall = () => {
        // If we are the caller, save the log before cleaning up
        if (activeCallRef.current) {
            saveCallLog();
        }

        // Cleanup 1-on-1
        if (connectionRef.current) connectionRef.current.destroy();

        // Cleanup Group
        groupPeersRef.current.forEach(p => p.peer.destroy());
        groupPeersRef.current = [];
        setGroupPeers([]);

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        if (isGroupCall) {
            socket.emit("leaveGroupCall", { groupId: call.groupId, userId: currentUserId });
        } else if (call.from) {
            socket.emit('endCall', { to: call.from });
        }

        // Reset State
        setCall({});
        setCallAccepted(false);
        setCallEnded(false);
        setStream(null);
        setIsCalling(false);
        setIsGroupCall(false);

        // Remove event listeners
        socket.off('callAccepted');
        socket.off('callDeclined');
    };

    const declineCall = () => {
        if (call.from) socket.emit('declineCall', { to: call.from });
        setCall({});
    };

    return (
        <CallingContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            callUser,
            leaveCall,
            answerCall,
            declineCall,
            callEnded,
            isCalling,
            // Group specific
            isGroupCall,
            groupPeers,
            startGroupCall,
            joinGroupCall
        }}>
            {children}
        </CallingContext.Provider>
    );
};

export { CallingContext };
