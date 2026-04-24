import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNewChatActive } from "../../redux/slices/aiSlice";
import AIChatSidebar from "../../components/AIChatSidebar";
import AIChatWindow from "../../components/AIChatWindow";

const AIChat = () => {
    const dispatch = useDispatch();
    const aiState = useSelector((state) => state.ai);
    const selectedConversation = aiState?.selectedConversation;
    const forceWindow = aiState?.newChatActive;

    const handleNewChatMobile = () => {
        dispatch(setNewChatActive(true));
    };

    const handleBack = () => {
        dispatch(setNewChatActive(false));
    };

    const showWindow = selectedConversation || forceWindow;

    return (
        <div className="flex flex-1 h-full overflow-hidden w-full relative bg-white dark:bg-[#0b1220]">
            {/* Sidebar (Chat History) */}
            <div className={`w-full md:w-[350px] h-full ${showWindow ? "hidden md:flex" : "flex"}`}>
                {aiState ? <AIChatSidebar onNewChat={handleNewChatMobile} /> : <div className="p-4">Loading AI...</div>}
            </div>

            {/* Chat Window - Forced Full Screen on Mobile when active */}
            <div className={`
                ${showWindow ? "flex" : "hidden md:flex"}
                flex-1 w-full h-full 
                ${showWindow ? "fixed inset-0 z-[100] md:relative md:z-auto" : ""}
                bg-white dark:bg-[#0b1220]
            `}>
                <AIChatWindow onBack={handleBack} />
            </div>
        </div>
    );
};

export default AIChat;
