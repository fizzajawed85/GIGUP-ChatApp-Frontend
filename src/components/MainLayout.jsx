import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ChatNavbar from './ChatNavbar';
import ChatSidebar from './ChatSidebar';
import { socket } from '../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { updateChatLatestMessage, updateChat } from '../redux/slices/chatSlice';
import { CallingProvider } from '../context/CallingContext';
import { NotificationProvider } from '../context/NotificationContext';
import IncomingCallModal from './IncomingCallModal';
import CallOverlay from './CallOverlay';
import NotificationSidebar from './NotificationSidebar';
import GroupCallOverlay from './GroupCallOverlay';

const MainLayout = () => {
    const dispatch = useDispatch();
    const { selectedChat } = useSelector((state) => state.chat);
    const { selectedGroup } = useSelector((state) => state.group);
    const aiState = useSelector((state) => state.ai);
    const selectedConversation = aiState?.selectedConversation;
    const newChatActive = aiState?.newChatActive;
    const isWindowOpen = !!(selectedChat || selectedGroup || selectedConversation || newChatActive);

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem("auth"));
        const userId = auth?.user?._id;

        if (userId) {
            const normalizedUserId = userId.toString().toLowerCase();
            socket.auth = { userId: normalizedUserId };
            socket.connect();
            socket.emit("addUser", normalizedUserId);

            socket.on("receiveMessage", (msg) => {
                dispatch(updateChatLatestMessage({ chatId: msg.chat, message: msg }));
                if (msg.sender?._id !== userId) {
                    socket.emit("messageDelivered", msg._id);
                }
            });

            socket.on("chatUpdated", (chat) => {
                dispatch(updateChat(chat));
            });
        }

        return () => {
            if (userId) {
                socket.emit("goOffline", userId);
                socket.off("receiveMessage");
                socket.off("chatUpdated");
                socket.disconnect();
            }
        };
    }, []);

    return (
        <NotificationProvider>
            <CallingProvider>
                <div className="h-[100dvh] w-full bg-white dark:bg-[#111727] flex flex-col overflow-hidden">
                    <header className={`z-50 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#111727] ${isWindowOpen ? 'hidden md:block' : ''}`}>
                        <ChatNavbar />
                    </header>

                    <div className="flex overflow-hidden min-h-0">
                        <ChatSidebar />
                        <main className={`flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#111727] ${isWindowOpen ? "pb-0" : "pb-16"} md:pb-0`}>
                            <Outlet />
                        </main>
                    </div>

                    <IncomingCallModal />
                    <CallOverlay />
                    <NotificationSidebar />
                    <GroupCallOverlay />
                </div>
            </CallingProvider>
        </NotificationProvider>
    );
};

export default MainLayout;
