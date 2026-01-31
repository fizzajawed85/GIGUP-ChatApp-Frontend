import React, { createContext, useState, useEffect, useCallback } from "react";
import { socket } from "../utils/socket";
import { getNotifications, markAllRead, clearNotifications } from "../services/notificationService";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fetch notifications from backend on load
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications();
                // Map backend model to frontend format if needed
                const formatted = data.map(n => ({
                    id: n._id,
                    type: n.type,
                    title: n.title,
                    content: n.content,
                    timestamp: new Date(n.createdAt),
                    read: n.read,
                    data: n.data
                }));
                setNotifications(formatted);
                setUnreadCount(formatted.filter(n => !n.read).length);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        const auth = JSON.parse(localStorage.getItem("auth"));
        if (auth?.token) {
            fetchNotifications();
        }
    }, []);

    // Add a new notification (live only)
    const addNotification = useCallback((notification) => {
        setNotifications(prev => {
            // Prevent duplicates based on specific ID (like msg._id)
            if (notification.id && prev.find(n => n.id === notification.id)) {
                return prev;
            }

            const newNotif = {
                id: notification.id || Date.now(),
                timestamp: new Date(),
                read: false,
                ...notification
            };

            setUnreadCount(count => count + 1);
            return [newNotif, ...prev].slice(0, 50);
        });
    }, []);

    useEffect(() => {
        const handleNewMessage = (msg) => {
            console.log(">>> Live Socket Signal: receiveMessage", msg);
            const auth = JSON.parse(localStorage.getItem("auth"));
            if (msg.sender?._id !== auth?.user?._id) {
                addNotification({
                    id: `msg_${msg._id}`,
                    type: 'message',
                    title: `New Message from ${msg.sender?.username || 'User'}`,
                    content: msg.text || 'Sent an attachment',
                    data: msg
                });
            }
        };

        const handleIncomingCall = ({ callerName, type, from }) => {
            console.log(">>> Live Socket Signal: incomingCall", { callerName, type, from });
            addNotification({
                id: `call_${from}_${Date.now()}`,
                type: 'call',
                title: `Incoming ${type === 'video' ? 'Video' : 'Audio'} Call`,
                content: `${callerName} is calling you...`,
                data: { from, type }
            });
        };

        const handleAIReply = (data) => {
            addNotification({
                id: `ai_${Date.now()}`,
                type: 'ai',
                title: 'Giga AI Response',
                content: 'Giga has finished thinking about your request.',
                data
            });
        };

        const handleGroupMessage = (msg) => {
            const auth = JSON.parse(localStorage.getItem("auth"));
            if (msg.sender?._id !== auth?.user?._id) {
                addNotification({
                    id: `gmsg_${msg._id}`,
                    type: 'group',
                    title: `Group: ${msg.groupName || 'New Message'}`,
                    content: `${msg.sender?.username}: ${msg.text || 'Attachment'}`,
                    data: msg
                });
            }
        };

        const handleAddedToGroup = (data) => {
            addNotification({
                id: `group_add_${data.groupId}_${Date.now()}`,
                type: 'system',
                title: 'New Group Added',
                content: `You've been added to "${data.groupName}"`,
                data
            });
        };

        // Attach listeners
        socket.on("receiveMessage", handleNewMessage);
        socket.on("incomingCall", handleIncomingCall);
        socket.on("aiReply", handleAIReply);
        socket.on("groupMessage", handleGroupMessage);
        socket.on("addedToGroup", handleAddedToGroup);

        return () => {
            socket.off("receiveMessage", handleNewMessage);
            socket.off("incomingCall", handleIncomingCall);
            socket.off("aiReply", handleAIReply);
            socket.off("groupMessage", handleGroupMessage);
            socket.off("addedToGroup", handleAddedToGroup);
        };
    }, [addNotification]);

    const markAllAsRead = async () => {
        try {
            await markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Sync Error: Failed to mark as read");
        }
    };

    const clearAll = async () => {
        try {
            await clearNotifications();
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("Sync Error: Failed to clear notifications");
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (!isSidebarOpen) {
            markAllAsRead();
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isSidebarOpen,
            toggleSidebar,
            markAllAsRead,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
