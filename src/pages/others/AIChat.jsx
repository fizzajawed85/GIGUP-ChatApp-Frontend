import React from "react";
import AIChatSidebar from "../../components/AIChatSidebar";
import AIChatWindow from "../../components/AIChatWindow";

const AIChat = () => {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden w-full">
            {/* Sidebar (Chat History) */}
            <AIChatSidebar />

            {/* Chat Window */}
            <div className="flex-1 min-w-0">
                <AIChatWindow />
            </div>
        </div>
    );
};

export default AIChat;
